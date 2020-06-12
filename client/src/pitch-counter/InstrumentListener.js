const PitchCounter = require('./PitchCounter.js');

class InstrumentListener {
    constructor(instrument) {
        this.pitchCounter = PitchCounter;
        this.get_pitch_count = function () {
            return this.pitchCounter.counter; };
        this.changeInstrument(instrument);
    }

    startListener() {
        this.pitchCounter.initPitchCounting();
        // this.pitchCounter.frequencyData = new Float32Array(
        //     512);
        // this.pitchCounter.audioContext.resume();
    }

    changeInstrument(instrument) {
        if (instrument == "piano") this.initPiano();
        else if (instrument == "voice") this.initVoice();
        else if (instrument == "guitar") this.initGuitar();
        else if (instrument == "percussion") this.initPercussion();
        else if (instrument == "strings") this.initStrings();
        else if (instrument == "winds") this.initWinds();
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

    initPiano() {
        this.pitchCounter.minSNR = .5;
        this.pitchCounter.rememberedFrames = 2;
        this.pitchCounter.smoother = .18;
        this.pitchCounter.simNoteThreshold = 1.5;
        this.pitchCounter.peakRequirement =
            this.createPeakRequirement(-90, -.11);
        this.pitchCounter.decibalConstant = 5;
        this.pitchCounter.bufferSize = 1024;
        this.pitchCounter.silenceBuffer = 14;
        this.pitchCounter.framesOfQuiet = this.pitchCounter.silenceBuffer + 1;
    }

    initVoice() {
        this.pitchCounter.minSNR = .5;
        this.pitchCounter.rememberedFrames = 2;
        this.pitchCounter.smoother = .1;
        this.pitchCounter.simNoteThreshold = 1.8;
        this.pitchCounter.peakRequirement =
            this.createPeakRequirement(-70, -.12);
        this.pitchCounter.decibalConstant = 7;
        this.pitchCounter.bufferSize = 4096;
        this.pitchCounter.silenceBuffer = 2;
        this.pitchCounter.framesOfQuiet = this.pitchCounter.silenceBuffer + 1;
    }

    initGuitar() {
        this.pitchCounter.minSNR = .5;
        this.pitchCounter.rememberedFrames = 2;
        this.pitchCounter.smoother = .05;
        this.pitchCounter.simNoteThreshold = 2;
        this.pitchCounter.peakRequirement =
            this.createPeakRequirement(-80, -.15);
        this.pitchCounter.decibalConstant = 5;
        this.pitchCounter.bufferSize = 512;
        this.pitchCounter.silenceBuffer = 8;
        this.pitchCounter.framesOfQuiet = this.pitchCounter.silenceBuffer + 1;
    }

    initPercussion() {
        this.pitchCounter.minSNR = 2;
        this.pitchCounter.rememberedFrames = 1;
        this.pitchCounter.smoother = .10;
        this.pitchCounter.simNoteThreshold = 1.25;
        this.pitchCounter.peakRequirement =
            this.createPeakRequirement(-80, -.12);
        this.pitchCounter.decibalConstant = 7;
        this.pitchCounter.bufferSize = 4096;
        this.pitchCounter.silenceBuffer = 3;
        this.pitchCounter.framesOfQuiet = this.pitchCounter.silenceBuffer + 1;
    }

    initStrings() {
        this.pitchCounter.minSNR = 1.5;
        this.pitchCounter.rememberedFrames = 2;
        this.pitchCounter.smoother = .3;
        this.pitchCounter.simNoteThreshold = 2;
        this.pitchCounter.peakRequirement =
            this.createPeakRequirsement(-55, -.1);
        this.pitchCounter.decibalConstant = 7;
        this.pitchCounter.bufferSize = 256;
        this.pitchCounter.silenceBuffer = 7;
        this.pitchCounter.framesOfQuiet = this.pitchCounter.silenceBuffer + 1;
    }

    initWinds() {
        this.pitchCounter.minSNR = .5;
        this.pitchCounter.rememberedFrames = 2;
        this.pitchCounter.smoother = .2;
        this.pitchCounter.simNoteThreshold = 1.5;
        this.pitchCounter.peakRequirement =
            this.createPeakRequirement(-80, -.10);
        this.pitchCounter.decibalConstant = 7;
        this.pitchCounter.bufferSize = 1024;
        this.pitchCounter.silenceBuffer = 6;
        this.pitchCounter.framesOfQuiet = this.pitchCounter.silenceBuffer + 1;
    }

    initDefault() {
        this.initVoice();
    }
}

const instrumentListener = new InstrumentListener("default");
module.exports = instrumentListener;
