class PitchCounterApp {

    constructor(instr) {
        this.instrument = new InstrumentListener(instr);
        this.get_pitch_count = function () {
            return this.instrument.getPitchCount;
        };
    }

    //Start the EventListener
    //Note: Cannot start on opening of the WebPage
    start() {
        this.instrument.startListener();
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

const app = new PitchCounterApp("default");

function Begin() {
    app.start();
}

function newNote() {
    console.log("0000000000000000000000000000000000000000");
}

function Stop() {
    app.stop();
}

function ChangeState() {
    app.change_state();
}

// module.exports = app
