var InstrumentListener = require('./InstrumentListener.js')

class PitchCounterApp {

    constructor(instr) {
        // this.instrument = require('./InstrumentListener.js')
        // this.instrument.changeInstrument(instr)
        this.instrument = new InstrumentListener(instr);
        // this.instrument = this.InstrumentListener.changeInstrument(instr)

        this.get_pitch_count = function () {
            return this.instrument.get_pitch_count();
        };
    }

    //Start the EventListener
    //Note: Cannot start on opening of the WebPage
    start() {
        this.instrument.startListener();
    }

    change_instrument(instr) {
        this.instrument.changeInstrument(instr)
    }

    //completely stop the event EventListener
    stop() {
        this.instrument.stopListener();
    }

    //pauses the EventListener and returns the current pitch_counter
    change_state() {
        return this.instrument.changeListenerState();
    }
}

const app = new PitchCounterApp("strings");

function Begin() {
    app.start();
}

function Stop() {
    app.stop();
}

function ChangeState() {
    app.change_state();
}

module.exports = app;
