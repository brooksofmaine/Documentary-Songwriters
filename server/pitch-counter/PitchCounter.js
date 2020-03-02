class PitchCounter {
    constructor() {
        this.bufferSize = 4096;
        this.prev_peaks = [];
        this.final_peaks = [];
        this.peaksInNote = [[], [], []];
        this.frequencyData;
        this.prev_time = 0;
        this.counter = 0; //total pitches counted
        this.curFrame = 0;

        //instrument dependent fields
        this.rememberedFrames = 0;
        this.smoother = 0;
        this.snr = 0;
        this.simNoteThreshold = 0;

        this.framesSinceQuiet = 0;
        this.lastPeakInNote;
        this.peakRequirement;
        this.framesOfQuiet = 0;
        this.prevAverageDecibals = -100;
    }

    initD3Peaks() {
        var ricker = d3_peaks.ricker;
        var findPeaks = d3_peaks.findPeaks()
            .kernel(ricker)
            .gapThreshold(1)
            .minLineLength(3)
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

            self.biquad.connect(self.scriptProcessor);
            self.scriptProcessor.connect(self.audioContext.destination);
            self.scriptProcessor
                .addEventListener('audioprocess', function(event) {
                    self.detect(); //process frequencies
                    // self.updateBiquad();
            })
        })
        .catch(function(error) {
            alert(error.name + ': ' + error.message);
        })
    }

    stop() {
        this.audioContext.close();
        this.audioContext = null;
    }

    //pause pitch counting
    changeState() {
        if(this.audioContext.state === 'running')
            this.audioContext.suspend();
        else if(this.audioContext.state === 'suspended')
            this.audioContext.resume();
    }

    //initialize EventListener
    init() {
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

    plotOutput() {
        document.getElementById('counter').innerHTML = this.counter; //?

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

        var trace3 = {
            x: [0, 200],
            y: [this.peakRequirement(0), this.peakRequirement(200)],
            type: 'scatter'
        };

        Plotly.newPlot('myDiv', [trace1, trace2, trace3], {}, {showSendToCloud:true});
    }

    //increase Pitch counter and reset list of peaks
    //Assumes that a new note has been found
    startNewNote() {
        this.framesSinceQuiet = 0;
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


    getSimilarNotes(oneDArr, twoDArr) {
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

    // Used to analyze peaks based off mutiple frames. Used for voice as voice
    // frequences are much more muddled
    analyzePeaks() {
        var similarNotes = 0;
        //Return if no notes are found
        if (this.final_peaks.length==0) {
            this.recordPeaks(this.rememberedFrames);
            return;
        }

        //increase found notes if no peaks were found previously but
        //peaks have now been found
        if (this.prev_peaks.length == 0 && this.final_peaks.length!=0) {
            this.startNewNote();
            return;
        }

        //count similar notes  between array
        var similarNewNotes = this.getSimilarNotes(this.final_peaks,
            this.peaksInNote);
        var similarOldNotes = this.getSimilarNotes(this.prev_peaks,
            this.peaksInNote);

        var allFullPeaks = true;
        for(var i = 0; i < this.peaksInNote.length; i ++) {
            if(this.peaksInNote[i].length == 0) {
                allFullPeaks = false;
                break;
            }
        }

        if (allFullPeaks && this.peaksInNote.length == this.rememberedFrames) {
            //if new notes and old notes are different start new note
            if (similarNewNotes <= Math.round(this.final_peaks.length / this.simNoteThreshold)) {
                if (similarOldNotes < Math.round(this.prev_peaks.length / this.simNoteThreshold)) {
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

    analyzePreviousPeak() {
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
            if (!(this.lastPeakInNote == this.final_peaks[0] && this.framesOfQuiet <= 2)) {
                this.startNewNote();
                return;
            }
        }

        var similarNotes = this.getSimilarNotes(this.final_peaks,
            [this.prev_peaks]);
        var currAverageDeciabls = this.getAverageDecibals(this.final_peaks);
        if (this.final_peaks.length > this.prev_peaks.length)
            var requiredNotes =
                Math.floor(this.prev_peaks.length / this.simNoteThreshold);
        else
            var requiredNotes =
                Math.floor(this.final_peaks.length / this.simNoteThreshold);

        // First, only consider a note to be new if it has been atleast three
        // frames since the last empty array of peaks.
        // This condition ensures that you only measure against a note after
        // its frequencies have reached their peaks.
        if (this.framesSinceQuiet > 2) {
            // Three cases define a new note:
            // Case 1:  There is a large increase in the number of peaks found
            if (this.final_peaks.length >= this.prev_peaks.length * 2.5)
                this.startNewNote();
            // Case 2:  The frequencies have increased in volume, indicating either
            //          a repeated note or a completely new one.
            else if (currAverageDeciabls > this.prevAverageDecibals + 7 && this.final_peaks.length > 2) {
                this.startNewNote();
            }
            // Case 3:  The previous peaks and the new peaks are different by
            //          atleast a factor of simNoteThreshold.
            else if (similarNotes < requiredNotes)
                this.startNewNote();
        }
        this.prevAverageDecibals = currAverageDeciabls;
    }

    updateBiquad() {
        // TODO: fix later
        var d = new Date();
        var deltaTime = Math.abs(this.prev_time - d.getTime()) / 1000;
        this.prev_time = d.getTime();
        //Let frequency coefficient in the biquad filter match
        //the update frequency
        this.biquad.frequency.value = 1/deltaTime;
    }

    detect() {
        this.updateBiquad();
        //retrieve new freqeuency data
        this.analyser.getFloatFrequencyData(this.frequencyData);
        //find peaks in first 250 frequency bins
        var peaks = this.findPeaks(this.frequencyData.slice(1, 200));
        this.final_peaks = [];
        for (var i = 0; i < Object.keys(peaks).length; i++) {
            //push new peaks that are not noise onto final_peaks
            if (this.frequencyData[peaks[i].index] > this.peakRequirement(peaks[i].index))
                this.final_peaks.push(peaks[i].index);
        }
        if (this.rememberedFrames == 1)
            this.analyzePreviousPeak();
        else
            this.analyzePeaks();
        this.prev_peaks = this.final_peaks;
        // this.plotOutput();
    }
}

const pitchCounter = new PitchCounter();
// module.exports = pitchCounter;
