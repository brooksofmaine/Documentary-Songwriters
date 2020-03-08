class PitchCounterApp {

    constructor(instr) {
        this.instrument = new InstrumentListener(instr);
        this.get_pitch_count = function () {
            return this.instrument.getPitchCount;
        };
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
    change_state() {
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
    app.change_state();
}

module.exports = app;
