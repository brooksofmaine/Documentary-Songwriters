
class PitchCounterApp {

    constructor(instr) {
        this.instrument = require('./InstrumentListener.js')
        this.instrument.changeInstrument(instr)
        // this.instrument = this.InstrumentListener.changeInstrument(instr)

        this.get_pitch_count = function () {
            return this.instrument.get_pitch_count();
        };
    }

    change_instrument(instr) {
        this.instrument.changeInstrument(instr)
    }

    // Start the EventListener
    // Note: Cannot start on opening of the WebPage
    start() {
        this.instrument.startListener();
    }

    // Completely stop the event EventListener
    stop() {
        this.instrument.stopListener();
    }

    // Pauses the EventListener and returns the current pitch_counter
    changeState() {
        return this.instrument.changeListenerState();
    }
}

const app = new PitchCounterApp("voice");

function Begin() {
    app.start();
}

function Stop() {
    app.stop();
}

function ChangeState() {
    app.changeState();
}

module.exports = app;
