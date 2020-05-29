const d3_peaks = require('./d3-peaks.js');

class PitchCounter {
    constructor() {
        this.counter = 0;
        this.prev_peaks = [];
        this.final_peaks = [];
        this.peaksInNote = [];
        this.frequencyData = new Float32Array();
        this.prev_time = 0;
        this.curFrame = 0;
        this.framesSinceQuiet = 0;
        this.framesOfQuiet = 0;
        this.lastPeakInNote = 0;
        this.prevAverageDecibels = -100;

        //instrument dependent fields
        this.bufferSize = 512;
        this.rememberedFrames = 0;
        this.smoother = 0;
        this.snr = 0;               // Signal to noise for a peak to be
                                    // considered a note
        this.simNoteThreshold = 0;  // Determines how many notes must be different
                                    // in order for a frame to contain a new note
        this.instrument = "";            // Name of current instrument
        this.decibalConstant = 0;       // Determines how much louder a frame must be
                                    // for it to be considered a new note
        this.peakRequirement = null;       // Required height for it to be considered
                                    // a note
        this.silenceBuffer = 0;         // Number of frames until a note can be
    }

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


    startRecord() {
        const self = this;
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            //initialize AudioContext nodes
            self.audioContext.createMediaStreamSource(stream)
                .connect(self.analyser);
            self.analyser.connect(self.biquad);

            var smoothValue = self.analyser.smoothingTimeConstant;
            self.analyser.smoothingTimeConstant = self.smoother; //// TODO: decrease?
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
        })
    }

    stop() {
        this.audioContext.close();
        this.audioContext = null;
        this.counter = 0;
    }

    initPitchCounting() {
        this.initListener();
        this.frequencyData = new Float32Array(
            this.analyser.frequencyBinCount);
        this.audioContext.resume();
    }

    //pause pitch counting
    changeState() {
        if (this.audioContext === null)
            this.initPitchCounting();
        else {
            this.audioContext.close();
            this.audioContext = null;
        }
    }

    //initialize EventListener
    initListener() {
        this.findPeaks = this.initD3Peaks();
        this.initGetUserMedia();
        this.audioContext = new window.AudioContext();
        this.analyser = this.audioContext.createAnalyser();
        // this.analyser.fftSize = 4096;
        this.biquad = this.audioContext.createBiquadFilter();

        //initalize biquad filter coefficients
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

    // Completely start pitch counter by initializing the listener and
    // by creating the starting Float32Array of frequencies
    initPitchCounting() {
            this.initListener();
            this.frequencyData = new Float32Array(
                this.analyser.frequencyBinCount);
            this.audioContext.resume();
    }

    //Stop Listening
    stop() {
        if (this.audioContext !== null) {
            this.audioContext.close();
            this.audioContext = null;
        }
    }

    //pause pitch counting
    changeState() {
        if (this.audioContext === null || this.audioContext === undefined)
            this.initPitchCounting();
        else {
            this.audioContext.close();
            this.audioContext = null;
        }
    }

    // Testing function to plot frequencies
    plotOutput() {
        document.getElementById('counter').innerHTML = "Current Pitch count: " + this.counter;

        var peakHeights = [];

        //find height of the peaks
        for(var i = 0; i < this.final_peaks.length; i ++) {
            peakHeights.push(this.frequencyData[this.final_peaks[i]]);
        }

        //trace of peaks
        var trace1 = {
            y: this.frequencyData,
            type: 'scatter',
        };

        //trace of all frequencies
        var trace2 = {
            x: this.final_peaks,
            y: peakHeights,
            mode: 'markers',
            marker: {
                color: 'rgb(219, 64, 82)',
                size: 6
            }
        };

        //trace of peak requirement
        var trace3 = {
            x: [0, 200],
            y: [this.peakRequirement(0), this.peakRequirement(200)],
            type: 'scatter'
        };

        // Plotly.newPlot('myDiv', [trace1, trace2, trace3], {}, {showSendToCloud:true});
    }

    // Increase Pitch counter and reset list of peaks
    // Assumes that a new note has been found
    startNewNote() {
        this.framesOfQuiet = 0;
        this.counter++;
        this.peaksInNote = []; //clear peaksInNote
        this.curFrame = 0;
        if (this.rememberedFrames != 1)
            this.recordPeaks(this.rememberedFrames);
    }

    //Adds peaks to a list of most recent peaks
    //Keeps track of numFrames number of frames
    recordPeaks(numFrames) {
        this.peaksInNote[this.curFrame] = this.final_peaks;
        this.curFrame = (this.curFrame + 1) % numFrames;
    }


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

    getAverageDecibals(arr) {
        var average = 0;
        for(var i = 0; i < arr.length; i ++) {
            average += this.frequencyData[arr[i]];
        }
        return average / arr.length;
    }

    getAverageDecibals() {
        var average = 0;
        for(var i = 0; i < this.frequencyData.length; i ++) {
            average += this.frequencyData[i];
        }
        return average / this.frequencyData.length;
    }

    // Used to analyze peaks based off mutiple frames. Used for voice as voice
    // frequences are much more muddled
    analyzeVoice() {
        var similarNotes = 0;
        //Return if no notes are found
        if (this.final_peaks.length==0) {
            this.framesSinceQuiet = 0;
            this.recordPeaks(this.rememberedFrames);
            this.framesOfQuiet++;
            return;
        }
        this.framesSinceQuiet ++

        //increase found notes if no peaks were found previously but
        //peaks have now been found
        if (this.framesSinceQuiet == 3 && this.framesOfQuiet > this.silenceBuffer) {
                this.startNewNote();
                return;
        }

        // Count similar notes  between array
        var similarNewNotes = this.findSimilarNotes(this.final_peaks,
            this.peaksInNote);
        var similarOldNotes = this.findSimilarNotes(this.prev_peaks,
            this.peaksInNote);

        var requiredNew = Math.floor(this.final_peaks.length / this.simNoteThreshold);
        var requiredOld = Math.floor(this.prev_peaks.length / this.simNoteThreshold);

        // Determine if 2d array of peaks is full.
        // In order to compare peaks, there must be atleast rememberedFrames
        // number of recorded frames with peaks
        var allFullPeaks = true;
        var framesOfNoise = this.peaksInNote.length;
        for(var i = 0; i < framesOfNoise; i ++) {
            if(this.peaksInNote[i].length == 0 || framesOfNoise < this.rememberedFrames) {
                allFullPeaks = false;
                break;
            }
        }

        if (allFullPeaks && this.peaksInNote.length == this.rememberedFrames) {
            //if new notes and old notes are different start new note
            if (similarNewNotes <= requiredNew && requiredNew > 0) {
                if (similarOldNotes <= requiredOld) {
                    this.startNewNote();
                }
                //if only new notes are different do not record them,
                //ensuring that two frames of peaks need to be different
                //in order to start a note
                return;
            }
        }
        this.recordPeaks(this.rememberedFrames);
    }

    analyzeInstrument() {
        // Stop analysis if their are no peaks to analyze
        if (this.final_peaks.length==0) {
            // Record the last peak that a note makes to ensure that the same
            // peak does not straddle the threshold as mentioned above
            if (this.prev_peaks.length == 1)
                this.lastPeakInNote = this.prev_peaks[0];
            this.framesOfQuiet ++;
            this.recordPeaks(this.rememberedFrames);
            return;
        }
        this.framesSinceQuiet ++;

        // Start new note if the frequencies in the current frame have peak
        // but the previous peaks are empty
        if (this.prev_peaks.length == 0 && this.final_peaks.length!=0) {
            // Ensure that when a frequency is fazing out (when it is ringing
            // in real life) that it does not hop above and below the threshold
            // triggering new notes.
            if (!(this.lastPeakInNote == this.final_peaks[0] || this.framesOfQuiet <= 2)) {
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
        if (requiredNotes == 0)
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

    updateBiquad() {
        var d = new Date();
        var deltaTime = Math.abs(this.prev_time - d.getTime()) / 1000;
        this.prev_time = d.getTime();
    }

    detectPitches() {
        this.updateBiquad();
        //retrieve new freqeuency data
        this.analyser.getFloatFrequencyData(this.frequencyData);
        //find peaks in first 200 frequency bins
        var peaks = this.findPeaks(this.frequencyData.slice(1, 200));
        this.final_peaks = [];
        var noisy = true;
        for (var i = 0; i < Object.keys(peaks).length; i++) {
            //push new peaks that are not noise onto final_peaks
            if (this.frequencyData[peaks[i].index] > this.peakRequirement(peaks[i].index)) {
                this.final_peaks.push(peaks[i].index);
                //if all peaks are greater than 80, the data is noisy
                if (peaks[i].index < 80)
                    noisy = false;

            }
        }
        //if note dissipears before two frames dont count
        if (!noisy || this.final_peaks.length == 0) {
            if (this.rememberedFrames == 1)
                this.analyzeInstrument();
            else
                this.analyzeVoice();
        }
        this.prev_peaks = this.final_peaks;
    }

    updateFrequencyBars() {
        var timeData = new Uint8Array(
            this.analyser.frequencyBinCount);
        this.analyser.getByteTimeDomainData(timeData);
        this.frequencyBars.updateFrequencyBars(this.frequencyData);
        }
}

const pitchCounter = new PitchCounter();
module.exports = pitchCounter;
