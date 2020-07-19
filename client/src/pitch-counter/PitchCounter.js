const d3_peaks = require('./d3-peaks.js');

/**
 * Summary. Listens to audio coming from a user's microphone and
 *          records the number of pitches they play or sing.
 *
 * @file   This files defines the PitchCounter class.
 * @author Adam Peters and Will Kendall.
 */

class PitchCounter {
    constructor() {
        this.counter = 0;
        this.prev_peaks = [];
        this.final_peaks = [];
        this.peaksInNote = [];
        this.frequencyData = null;
        this.curFrame = 0;
        this.framesSinceQuiet = 0;
        this.framesOfQuiet = 0;
        this.lastPeakInNote = 0;
        this.prevAverageDecibels = -100;

        //instrument dependent fields
        this.bufferSize = 512;          // A power of 2 between 256 and 4096.
                                        // The lower the bufferSize the
                                        // faster the update frequency
        this.noteBuffer = 0;
        this.rememberedFrames = 0;      // The number of frames the algorithm will
                                        // store at one time. Helps analyze noisy data
        this.smoother = 0;
        this.snr = 0;                   // Signal to noise for a peak to be
                                        // considered a note
        this.simNoteThreshold = 0;      // Determines how many notes must be different
                                        // in order for a frame to contain a new note
        this.instrument = "";           // Name of current instrument
        this.decibalConstant = 0;       // Determines how much louder a frame must be
                                        // for it to be considered a new note
        this.peakRequirement = null;    // Required height for it to be considered
                                        // a note
        this.silenceBuffer = 0;         // Number of frames of silence that must
                                        // pass before a note can be found
    }


    /**
     * Initializes the d3 peaks object, which is used to isolate
     * peaks in the noisy frequency data
     */
    initD3Peaks() {
        var ricker = d3_peaks.ricker;
        var findPeaks = d3_peaks.findPeaks()
            .kernel(ricker)
            .gapThreshold(.5)
            .minLineLength(2.5)
            .minSNR(this.snr)
            .widths([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        return findPeaks;
    }

    /**
     * Creates the media device, which connects the code to the user's
     * microphone
     */
    initGetUserMedia() {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!window.AudioContext) {
            return alert('AudioContext not supported');
        }

        // Older browsers might not implement mediaDevices at all,
        // so we set an empty object first
        if (navigator.mediaDevices === undefined) {
            navigator.mediaDevices = {};
        }

        // Some browsers partially implement mediaDevices. We can't just
        // assign an object with getUserMedia as it would overwrite existing .
        // properties. Here, we will just add the getUserMedia
        // property if it's missing.
        if (navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = function(constraints) {
                // First get ahold of the legacy getUserMedia, if present
                const getUserMedia =
                    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

                // Some browsers just don't implement it - return a rejected
                // promise with an error to keep a consistent interface
                if (!getUserMedia)
                    alert('getUserMedia is not implemented in this browser');

                // Otherwise, wrap the call to the old
                // navigator.getUserMedia with a Promise
                return new Promise(function(resolve, reject) {
                    getUserMedia.call(navigator, constraints, resolve, reject);
                })
            }
        }
    }

    /**
     * Start recording frames and analyzing them
     */
    startRecord() {
        const self = this;
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            //initialize AudioContext nodes
            self.audioContext.createMediaStreamSource(stream)
                .connect(self.analyser);
            self.analyser.connect(self.biquad);

            self.analyser.smoothingTimeConstant = self.smoother;
            self.analyser.fftSize = 1024;
            self.biquad.connect(self.scriptProcessor);
            self.scriptProcessor.connect(self.audioContext.destination);
            self.scriptProcessor
                .addEventListener('audioprocess', function(event) {
                    self.detectPitches(); //process frequencies
            })
        })
        .catch(function(error) {
            alert(error.name + ': ' + error.message);
            // TODO: fix this
        })
    }
    // Completely start pitch counter by initializing the listener and
    // by creating the starting Float32Array of frequencies

    /**
     * Begins the flow of initializations by calling the listener to begin,
     * and by creating the array that will store the frequencyData.
     */
    initPitchCounting() {
        this.initListener();
        this.frequencyData = new Float32Array(
            this.analyser.frequencyBinCount);
        this.audioContext.resume();
}

    /**
     * Pause Listening and analyzing. If AudioContext has not been created
     * (aka the code was not analyzing), then start counting pitches.
     */
    changeState() {

        if (this.audioContext === null || this.audioContext === undefined)
            this.initPitchCounting();
        else {
            this.audioContext.close();
            this.audioContext = null;
        }
    }

    /**
     * Initializes the device that listens to audio (initGetUserMedia),
     * initializes d3 peaks to aid in frequency analysis,
     * creates audioContext, which compresses, analyzes, and gives the
     * frequency data, then starts startRecord.
     */
    initListener() {
        this.findPeaks = this.initD3Peaks();
        this.initGetUserMedia();
        this.audioContext = new window.AudioContext();
        this.analyser = this.audioContext.createAnalyser();
        this.biquad = this.audioContext.createBiquadFilter();

        // initalize biquad filter coefficients
        this.biquad.Q.value = .707;
        this.biquad.frequency.value = 4400;
        this.biquad.gain.value = 1000;
        this.biquad.type = 'bandpass';
        this.scriptProcessor = this.audioContext.createScriptProcessor(
            this.bufferSize,
            1,
            1
        );
        this.startRecord();
    }

    //Stop Listening
    stop() {
        if (this.audioContext !== null && this.audioContext !== undefined) {
            this.audioContext.close();
            this.audioContext = null;
        }
    }

    /**
     * Start analyzing a new noteIf a new note has been found, then this
     * function is called. When starting to analyzing a new note, framesOfQuiet
     * must be reset to zero, the note counter must increase, the previously
     * recordedfrequencies in a note (peaksInNote) must be cleared, as the new
     * note has no recorded peaks yet.
     */
    startNewNote() {
        this.framesOfQuiet = 0;
        this.counter++;
        this.peaksInNote = []; //clear peaksInNote
        this.curFrame = 0;

        // When remembered frames equals one, a frame of
        if (this.rememberedFrames !== 1)
            this.recordPeaks(this.rememberedFrames);
    }

    /**
     * Adds peaks to a list of most recent peaks. curFrame helps keep track
     * of where the most recent frequencies (final_peaks) belongs
     * in peaksInNote.
     */
    recordPeaks(numFrames) {
        this.peaksInNote[this.curFrame] = this.final_peaks;
        this.curFrame = (this.curFrame + 1) % numFrames;
    }

    /**
     * Finds similar elements between a 1d array and a 2darray.
     *
     * @param {array} oneDArr: some 1d array of numbers
     * @param {2darray} twoDArr: some 2d array of numbers
     * @return {number} the number of similar elements between the
     *                  two arrays. Elements are similar if they have a
     *                  difference less than or equal to 1.
     */
    findSimilarNotes(oneDArr, twoDArr) {
        var similarNotes = 0;
        loop1:
        for(var k = 0; k < oneDArr.length; k ++) {
            for(var i = 0; i < twoDArr.length; i ++) {
                for(var j = 0; j < twoDArr[i].length; j ++) {
                    if (Math.abs(twoDArr[i][j] - oneDArr[k]) <= 1) {
                        similarNotes ++;
                        continue loop1;
                    }
                }
            }
        }
        return similarNotes;
    }

    /**
     * Returns the average deciabls (loudness) of certain frequences
     *
     * @param {array} peaks: some array of peaks. Peaks are represented as
     *                     an array of freqeuency buckets. For instance,
     *                     arr could be [23, 45, 82]. The function, then,
     *                     would find the average freqeuncy of those
     *                     buckets in the freqeuncyData array
     * @return {number} the average deciabls of the peaks in arr
     */
    getAverageDecibals(peaks) {
        var average = 0;
        for(var i = 0; i < peaks.length; i ++) {
            average += this.frequencyData[peaks[i]];
        }
        return average / peaks.length;
    }

    /**
     * Analyzes a current frame of frequency data by comparing it to
     * peaksInNote (the list of the most recent frequencies). Unlike
     * analyzeWithoutMemory, this function compares the current frame
     * of frequency data (final_peaks) and the previous frame (prev_peaks)
     * to a list of the most recent frequencies. This strategy helps to
     * deal with the innate fluctations of sound. analyzeWithMemory records
     * rememberedFrames amount of frames in peaksInNote. It then compares
     * final_peaks and prev_peaks to those remembered frames.
     */
    analyzeWithMemory() {
        var similarNotes = 0;
        // Return if no notes are found
        if (this.final_peaks.length === 0) {
            this.framesSinceQuiet = 0;
            this.recordPeaks(this.rememberedFrames); //record empty frequencies
            this.framesOfQuiet++;
            return;
        }
        this.framesSinceQuiet ++

        // Increase found notes if no peaks were found previously but
        // peaks have now been found
        // A minimum of three frames of noise must occur to start a note. (this)
        // helps filter out small little frequency upticks that are bound to
        // occur
        if (this.framesSinceQuiet === 3 && this.framesOfQuiet > this.silenceBuffer) {
                this.startNewNote();
                return;
        }

        // Count similar notes between final_peaks and peaksInNote and
        // between prev_peaks and peaksInNote.
        var similarNewNotes = this.findSimilarNotes(this.final_peaks,
            this.peaksInNote);
        var similarOldNotes = this.findSimilarNotes(this.prev_peaks,
            this.peaksInNote);

        // Calculate the number of new notes in final_peaks and prev_peaks
        // that must be shared with peaksInNote
        var requiredNew = Math.floor(this.final_peaks.length / this.simNoteThreshold);
        var requiredOld = Math.floor(this.prev_peaks.length / this.simNoteThreshold);

        // Determine if 2d array of peaks is full.
        // In order to compare peaks, there must be atleast rememberedFrames
        // number of recorded frames with peaks
        var allFullPeaks = true;
        var framesOfNoise = this.peaksInNote.length;
        for(var i = 0; i < framesOfNoise; i ++) {
            if(this.peaksInNote[i].length === 0 || framesOfNoise < this.rememberedFrames) {
                allFullPeaks = false;
                break;
            }
        }

        // Determine if a new note has occured only if peaksInNote is full.
        // You do not want to look for a new note if there is not enough
        // data about a note yet, so you must wait for peaks to be full
        // of peaks.
        if (allFullPeaks && this.peaksInNote.length === this.rememberedFrames && this.framesSinceQuiet > this.noteBuffer) {
            // if new notes and old notes are different start new note
            if (similarNewNotes <= requiredNew && requiredNew > 0) {
                if (similarOldNotes <= requiredOld) {
                    this.startNewNote();
                }
                // if only new notes are different do not record those peaks,
                // ensuring that you do not add final_peaks to the list,
                // and then compare it to itself in the following frame.
                // This strategy ensures that two frames of peaks
                // must stubstantially differ from peaksInNote.
                return;
            }
        }
        this.recordPeaks(this.rememberedFrames);
    }


    /**
     * Analyzes a current frame of frequency data by comparing it to
     * the previous frame. This function has no memory, and only compares
     * the current frame to the previous frame. Because of this, this
     * strategy is faster yet less consistent. As sound is inherently
     * noisy, the strategy requires near perfect sound quality and very
     * little background noise. Becuase those conditions are near impossible
     * to meet, this function is rarely used to count pitches.
     */
    analyzeWithoutMemory() {
        // Stop analysis if their are no peaks to analyze
        if (this.final_peaks.length === 0) {

            // Sometimes, a single peak straddles the note threshold (as
            // the remnant of a note). This peak will oscillate above
            // and then below the note threshold and trigger the counter to
            // increase rapidly. If final_peaks is empty and prev_peaks
            // contains one peak, that one peak is will fluctuate and
            // increase the counter like I outlined above. To combat this
            // error, I record this one peak into lastPeakInNote, and then
            // ensure that the counter does not increase if that peak returns
            if (this.prev_peaks.length === 1)
                this.lastPeakInNote = this.prev_peaks[0];
            this.framesOfQuiet ++;
            this.recordPeaks(this.rememberedFrames);
            return;
        }
        this.framesSinceQuiet ++;

        // Start new note if the frequencies in the current frame have peaks
        // but the previous peaks are empty
        if (this.prev_peaks.length === 0 && this.final_peaks.length !== 0) {
            // Ensure that when a frequency is fazing out (when it is ringing
            // in real life) that it does not hop above and below the threshold
            // triggering new notes.
            if (!(this.lastPeakInNote === this.final_peaks[0] || this.framesOfQuiet <= 2)) {
                this.startNewNote();
                return;
            }
        }


        var similarNotes = this.findSimilarNotes(this.final_peaks,
            [this.prev_peaks]);
            var currAverageDeciabls = this.getAverageDecibals(this.final_peaks);
        if (this.final_peaks.length > this.prev_peaks.length)
            var requiredNotes =
                Math.floor(this.prev_peaks.length / this.simNoteThreshold);
        else
            var requiredNotes =
                Math.floor(this.final_peaks.length / this.simNoteThreshold);
        if (requiredNotes === 0)
            requiredNotes = 1;

        if (this.framesSinceQuiet > 8) {
            // Three cases define a new note:
            // Case 1:  There is a large increase in the number of peaks found
            if (this.final_peaks.length >= this.prev_peaks.length * 2.5)
                this.startNewNote();
            // Case 2:  The frequencies have increased in volume, indicating either
            //          a repeated note or a completely new one.
            else if (currAverageDeciabls > this.prevAverageDecibels + this.decibalConstant
                        && this.final_peaks.length > 4) {
                this.startNewNote();
            }
            // Case 3:  The previous peaks and the new peaks are different by
            //          atleast a factor of simNoteThreshold.
            else if (similarNotes < requiredNotes)
                this.startNewNote();
        }
        this.prevAverageDecibels = currAverageDeciabls;
    }

    detectPitches() {
        // Retrieve new freqeuency data
        this.analyser.getFloatFrequencyData(this.frequencyData);
        // Find peaks in first 200 frequency bins.
        // When a note is played, is causing a cascade of overtones
        // and undertones to rise in the frequency data. Because of this,
        // you can find notes in those harmonics, and so analyzing data
        // above around 200 peaks in not neccesary.
        var peaks = this.findPeaks(this.frequencyData.slice(1, 200));
        this.final_peaks = [];
        var noisy = true;
        for (var i = 0; i < Object.keys(peaks).length; i++) {
            // Push new peaks that are not noise onto final_peaks
            if (this.frequencyData[peaks[i].index] > this.peakRequirement(peaks[i].index)) {
                this.final_peaks.push(peaks[i].index);
                // If all peaks are greater than 80, the data is noisy.
                // Musical pitches always result in peaks below the 80th bin.
                if (peaks[i].index < 80)
                    noisy = false;

            }
        }

        if (!noisy || this.final_peaks.length === 0) {
            if (this.rememberedFrames === 1)
                this.analyzeWithoutMemory();
            else
                this.analyzeWithMemory();
        }
        this.prev_peaks = this.final_peaks;
    }

    /**
     * If the frequencyBars are being used to visualize the sound,
     * then this function can be called to update those frequency bars.
     */
    updateFrequencyBars() {
        this.frequencyBars.updateFrequencyBars(this.frequencyData);
        }
}

export const pitchCounter = new PitchCounter();
