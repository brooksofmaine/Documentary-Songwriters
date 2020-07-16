const PitchCounter = require('./PitchCounter.js').pitchCounter;

/**
 * Summary. Listens to an instrument's audio coming from a user's microphone and
 *          records the number of pitches they play or sing. Contains a
 *          PitchCounter object and alters instrument dependent fields in
 *          order to optimize pitch counting of specific instruments.
 *
 * @file   This files defines the InstrumentListener class.
 * @author Adam Peters.
 */

class InstrumentListener {
    constructor(instrument) {
        this.pitchCounter = PitchCounter;
        this.get_pitch_count = function () {
            return this.pitchCounter.counter; };
        this.changeInstrument(instrument);
    }

    /**
     * Completely start listening and counting an instrument
     */
    startListener() {
        this.pitchCounter.initPitchCounting();
    }

    /**
     * Change the Instrument to which this is listening
     *
     * @param {instrument} the String name of the instrument
     */
    changeInstrument(instrument) {
        if (instrument.toLowerCase() == "piano") this.initPiano();
        else if (instrument.toLowerCase() == "voice") this.initVoice();
        else if (instrument.toLowerCase() == "guitar") this.initGuitar();
        else if (instrument.toLowerCase() == "percussion") this.initPercussion();
        else if (instrument.toLowerCase() == "strings") this.initStrings();
        else if (instrument.toLowerCase() == "winds") this.initWinds();
        else if (instrument.toLowerCase() == "brass") this.initBrass();
        else this.initDefault();
    }

    /**
     * Completely stop listening and reset counter to 0
     */
    stopListener() {
        this.pitchCounter.stop();
        this.pitchCounter.counter = 0;
    }

    /**
     * Pause listening and pause counter. (Does not reset counter.)
     */
    changeListenerState() {
        this.pitchCounter.changeState();
        return this.get_pitch_count();
    }

    /**
     * Creates the requirement to consider a peak when analyzing the
     * frequencies. Frequencies above the peak will be considered when
     * counting notes.
     *
     * @param {yInt} number y intercept of the requirement
     * @param {slope} number slope of the requirement
     * @return {function} a peakRequirement function that maps an x coordinate
     *                    (which is a frequency bin) to the requirement for
     *                    that frequency to be considered part of a note.
     */
    createPeakRequirement(yInt, slope) {
        return function(x) {
            return slope * x + yInt;
        }
    }

    /**
     * Initialize the piano listener.
     */
    initPiano() {
        this.pitchCounter.minSNR = .5;
        this.pitchCounter.rememberedFrames = 3;
        this.pitchCounter.smoother = .03; //.05
        this.pitchCounter.simNoteThreshold = 1.8;
        this.pitchCounter.peakRequirement =
            this.createPeakRequirement(-75, -.25);
        this.pitchCounter.decibalConstant = 5;
        this.pitchCounter.bufferSize = 512;
        this.pitchCounter.silenceBuffer = 8;
        this.pitchCounter.framesOfQuiet = this.pitchCounter.silenceBuffer + 1;
        this.pitchCounter.noteBuffer = 5;
    }

    /**
     * Initialize the voice listener.
     */
    initVoice() {
        this.pitchCounter.minSNR = .5;
        this.pitchCounter.rememberedFrames = 3;
        this.pitchCounter.smoother = .4;
        this.pitchCounter.simNoteThreshold = 1.8;
        this.pitchCounter.peakRequirement =
            this.createPeakRequirement(-70, -.12);
        this.pitchCounter.decibalConstant = 7;
        this.pitchCounter.bufferSize = 2048;
        this.pitchCounter.silenceBuffer = 8;
        this.pitchCounter.framesOfQuiet = this.pitchCounter.silenceBuffer + 1;
    }

    /**
     * Initialize the guitar listener.
     */
    initGuitar() {
        this.pitchCounter.minSNR = .1;
        this.pitchCounter.rememberedFrames = 4;
        this.pitchCounter.smoother = .6; //.6
        this.pitchCounter.simNoteThreshold = 2.5;
        this.pitchCounter.peakRequirement =
            this.createPeakRequirement(-85, -.15);
        this.pitchCounter.decibalConstant = 5;
        this.pitchCounter.bufferSize = 256;
        this.pitchCounter.silenceBuffer = 4;
        this.pitchCounter.framesOfQuiet = this.pitchCounter.silenceBuffer + 1;
        this.pitchCounter.noteBuffer = 10;
    }

    /**
     * Initialize the percussion listener.
     */
    initPercussion() {
        this.pitchCounter.minSNR = .1;
        this.pitchCounter.rememberedFrames = 4;
        this.pitchCounter.smoother = .45;
        this.pitchCounter.simNoteThreshold = 4;
        this.pitchCounter.peakRequirement =
            this.createPeakRequirement(-90, -.11);
        this.pitchCounter.decibalConstant = 3;
        this.pitchCounter.bufferSize = 512;
        this.pitchCounter.silenceBuffer = 1;
        this.pitchCounter.framesOfQuiet = this.pitchCounter.silenceBuffer + 1;
    }

    /**
     * Initialize the strings listener.
     */
    initStrings() {
        this.pitchCounter.minSNR = .5;
        this.pitchCounter.rememberedFrames = 2;
        this.pitchCounter.smoother = .25; //1.5
        this.pitchCounter.simNoteThreshold = 1.7;
        this.pitchCounter.peakRequirement =
            this.createPeakRequirement(-60, -.1);
        this.pitchCounter.decibalConstant = 7;
        this.pitchCounter.bufferSize = 256;
        this.pitchCounter.silenceBuffer = 5; // decrease?
        this.pitchCounter.framesOfQuiet = this.pitchCounter.silenceBuffer + 1;
        this.pitchCounter.noteBuffer = 15;
    }

    /**
     * Initialize the winds listener.
     */
    initWinds() {
        this.pitchCounter.minSNR = .5;
        this.pitchCounter.rememberedFrames = 3;
        this.pitchCounter.smoother = .1;
        this.pitchCounter.simNoteThreshold = 1.8;
        this.pitchCounter.peakRequirement =
            this.createPeakRequirement(-70, -.10);
        this.pitchCounter.decibalConstant = 7;
        this.pitchCounter.bufferSize = 256;
        this.pitchCounter.silenceBuffer = 4;
        this.pitchCounter.framesOfQuiet = this.pitchCounter.silenceBuffer + 1;
    }

    /**
     * Initialize the brass listener.
     */
    initBrass() {
        this.pitchCounter.minSNR = .5;
        this.pitchCounter.rememberedFrames = 3;
        this.pitchCounter.smoother = .45;
        this.pitchCounter.simNoteThreshold = 1.7;
        this.pitchCounter.peakRequirement =
            this.createPeakRequirement(-55, -.1);
        this.pitchCounter.decibalConstant = 7;
        this.pitchCounter.bufferSize = 256;
        this.pitchCounter.silenceBuffer = 10; // decrease?
        this.pitchCounter.framesOfQuiet = this.pitchCounter.silenceBuffer + 1;
    }

    /**
     * Initialize the deafualt listener, which is just the voice listener.
     * The voice listener filters the most noise, so it is useful as a default.
     */
    initDefault() {
        this.initVoice();
    }
}
export const instrumentListener = new InstrumentListener("default");
