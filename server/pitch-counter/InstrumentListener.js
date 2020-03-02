class InstrumentListener {
    //// ADDD HORNS
    //// Winds
    //// Banjo
    //// Hand Percussion
    ////
    constructor(instrument) {
        this.pitchCounter = new PitchCounter();
        this.get_pitch_count = function () { return this.pitchCounter.counter; };
        this.changeInstrument(instrument);
    }

    startListener() {
        this.pitchCounter.init();
        this.pitchCounter.frequencyData = new Float32Array(
            this.pitchCounter.analyser.frequencyBinCount);
        this.pitchCounter.audioContext.resume();
    }

    changeInstrument(instrument) {
        if (instrument == "piano") this.initPiano();
        else if (instrument == "voice") this.initVoice();
        else if (instrument == "guitar") this.initGuitar();
        else if (instrument == "percussion") this.initPercussion();
        else if (instrument == "strings") this.initStrings();
        else this.initDefault();
    }

    stopListener() {
        this.pitchCounter.stop();
        this.pitchCounter.counter = 0;
    }

    changeListenerState() {
        this.pitchCounter.changeState();
        return this.get_pitch_count();
    }

    createPeakRequirement(yInt, slope) {
        return function(x) {
            return slope * x + yInt;
        }
    }

    //working
    initPiano() {
        this.pitchCounter.minSNR = .5;
        this.pitchCounter.rememberedFrames = 1;
        this.pitchCounter.smoother = .15;
        this.pitchCounter.simNoteThreshold = 2;
        this.pitchCounter.peakRequirement =
            this.createPeakRequirement(-60, -.1);
    }

    //sorta
    initVoice() {
        this.pitchCounter.minSNR = 3;
        this.pitchCounter.rememberedFrames = 4;
        this.pitchCounter.smoother = .25;
        this.pitchCounter.simNoteThreshold = 1.5;
        this.pitchCounter.peakRequirement =
            this.createPeakRequirement(-70, -.15);
    }

    //working (look later)
    initGuitar() {
        this.pitchCounter.minSNR = 1.5;
        this.pitchCounter.rememberedFrames = 1;
        this.pitchCounter.smoother = .2;
        this.pitchCounter.simNoteThreshold = 1.5;
        this.pitchCounter.peakRequirement =
            this.createPeakRequirement(-70, -.15);
    }

    initPercussion() {
        this.pitchCounter.minSNR = 1;
        this.pitchCounter.rememberedFrames = 1;
        this.pitchCounter.smoother = .10;
        this.pitchCounter.simNoteThreshold = 1.25;
        this.pitchCounter.peakRequirement =
            this.createPeakRequirement(-70, -.15);

    }

    //working
    initStrings() {
        this.pitchCounter.minSNR = 1.5;
        this.pitchCounter.rememberedFrames = 1;
        this.pitchCounter.smoother = .2;
        this.pitchCounter.simNoteThreshold = 2;
        this.pitchCounter.peakRequirement =
            this.createPeakRequirement(-50, -.1);
    }


    initDefault() {
        this.initPiano();
    }
}
