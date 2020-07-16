/**
 * Summary. Contains the implementation to create a instrument dependent
 *          pitch counter. Exports a PitchCounterApp object for
 *          a react file to use.
 *
 * @file   This files defines the PitchCounterApp class.
 * @author Adam Peters.
 */

class PitchCounterApp {

    constructor(instr) {
        this.instrument = require('./InstrumentListener.js').instrumentListener;
        this.instrument.changeInstrument(instr);
        this.get_pitch_count = function () {
            return this.instrument.get_pitch_count();
        };
    }

    /**
     * Change the Instrument to which the app is listening
     *
     * @param {instr} the String name of the instrument
     */
    change_instrument(instr) {
        this.instrument.changeInstrument(instr)
    }

    /**
     * Start the EventListener. Cannot start on opening of WebPage due
     * to AudioContext limitations.
     */
    start() {
        this.instrument.startListener();
    }

    /**
     * Completely stop the app from listening.
     */
    stop() {
        this.instrument.stopListener();
    }

    /**
     * Pause the app from listening.
     */
     changeState() {
        return this.instrument.changeListenerState();
    }
}

export const app = new PitchCounterApp("voice");

function Begin() {
    app.start();
}

function Stop() {
    app.stop();
}

function ChangeState() {
    app.changeState();
}
