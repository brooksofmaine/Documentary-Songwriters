import React from "react";
import Counter from './Counter';
import Stopwatch from './Stopwatch';
import './Record.css';

import UserFunc from "../api-helper/user";
import InstrumentListener from '../pitch-counter/InstrumentListener.js'
import PitchCounter from '../pitch-counter/PitchCounter.js'
import app from '../pitch-counter/PitchCounterApp.js'
import RecordingFunc from "../api-helper/recording";
import RecordFilter from './RecordFilter';
import StopPopup from './StopPopup';
import SavePopup from './SavePopup';
import FrequencyBars from './FrequencyBars';

// Function to pause: change_state

// import PitchCounter  from '../../server/pitch-counter/pitch_counter'


class Record extends React.Component {
    constructor() {
        super()

        this.selectedInstrument = "voice";
        app.change_instrument(this.selectedInstrument)

        this.state = {
            count: 0,
            overlayStyle : {
                width: 0,
                height: 0
            },
            stopping : false,
            saving : false,
            instrument : "Piano",
            length : 0,
            pitches : 0,

            removeMessage : "",
            lastPlayedInstrument : ""
        }

        this.handleClick = this.handleClick.bind(this);
        this.restart = this.restart.bind(this);
        this.removePopup = this.removePopup.bind(this);
        this.showPopup = this.showPopup.bind(this);
        this.saveRecording = this.saveRecording.bind(this);
        this.prettyTime = this.prettyTime.bind(this);
    }

    async componentDidMount() {

        let username;
        let instrument;

        await UserFunc.getCurrentUsername()
            .then(name => username = name);
        await UserFunc.lastPlayedInstrument(username)
            .then(instr => instrument = instr);

        if ( instrument !== null ) {
            this.setState({
                lastPlayedInstrument : instrument
            });
        }
        else {
            this.setState({
                lastPlayedInstrument : "Piano"
            })
        }

        this.interval = setInterval(() => {
            let instr, time;

            if ( this.stopwatch ) {
                time = this.stopwatch.state.timerTime;
            }
            else {
                time = null;
            }

            if ( this.filter ) {
                instr = this.filter.state.instrument;
            }
            else {
                instr = null;
            }

            this.setState({
                instrument : instr,
                length : this.prettyTime(time)
        })}, 1000);

        let frequency = 16; // TEMPORARY

        this.frequency = setInterval(() => {
            if ( this.frequencyBars !== null ) {
                this.frequencyBars.updateFrequencyBars(app.instrument.pitchCounter.frequencyData);
                this.setState({
                    count: app.get_pitch_count()
                });
            }
        }, frequency);
    }

    // Temporary function--only used to demonstrate counter
    // component
    handleClick() {
        // console.log(app.get_pitch_count())
        // this.setState((state, props) => ({
        //     count: app.get_pitch_count()
        // }))
    }

    restart() {
        this.removePopup("stop");
        this.stopwatch.resetTimer("stop");
    }

    showPopup(popup, reason) {
        this.stopwatch.stopTimer();

        if ( popup === "stop" ) {

            // only ask about restart if actually recorded anything or changed instrument
            if ( this.stopwatch.state.timerTime > 0 ) {
                this.setState({
                    stopping : true,
                    overlayStyle: {
                        width  : "105%",
                        height : "110vh"
                    }
                });

                if ( reason === "instrument" ) {
                    this.setState({
                        removeMessage : "Changing instruments in the middle of the recording"
                    });
                }
                else {
                    this.setState({
                        removeMessage : "Stopping your recording"
                    });
                }
            }
        }
        else { // save
            this.setState({
                saving : true,
                overlayStyle: {
                    width  : "105%",
                    height : "110vh"
                }
            })
        }
    }

    removePopup(popup) {
        if ( popup === "stop" ) {
            this.setState({
                stopping : false
            });
        }
        else { // save
            this.setState({
                saving : false
            });
        }

        this.setState({
            overlayStyle : {
                width: 0,
                height: 0
            }
        });
    }

    saveRecording(description) {
        // TODO: fix start and end times
        // TODO: fix connection error? (recording.js:137)
        const now = Date.now();
        const endTime = new Date(now);
        const startTime = new Date(now - this.stopwatch.state.timerTime);
        console.log(startTime)
        console.log(this.stopwatch.state.timerTime)
        RecordingFunc.newRecording(
            this.state.count,     // pitches
            this.state.instrument,  // instrument
            description,            // description
            startTime,              // start time
            endTime                 // end time
            );

        // TODO: handle errors somehow
        // TODO: make this link to progress page when it exists
        this.props.history.push("/api/progress");


    }

    prettyTime(milliseconds) {

        let seconds = ("0" + (Math.floor(milliseconds / 1000) % 60)).slice(-2);
        let minutes = ("0" + (Math.floor(milliseconds / 60000) % 60)).slice(-2);
        let hours   = ("0" + Math.floor(milliseconds / 3600000)).slice(-2);

        return hours + " : " + minutes + " : " + seconds;
    }

    render() {

        return(
            <div className="Record">
                <div className="RecordOverlay" style={this.state.overlayStyle}></div>
                <div style = {this.state.stopping ? {} : {display: "none"}}>
                    <StopPopup reset = {this.restart} noReset = {this.removePopup} message = {this.state.removeMessage} />
                </div>
                <div style = {this.state.saving ? {} : {display : "none"}} ref = {filterContainer => this.filterContainer = filterContainer}>
                    <SavePopup exit = {this.removePopup} save = {this.saveRecording} instrument = {this.state.instrument} length = {this.state.length} pitches = {this.state.pitches}/>
                </div>
                <RecordFilter defaultInstrument = {this.state.lastPlayedInstrument} changeInstrument={() => this.showPopup("stop", "instrument")} ref = {filter => this.filter = filter}/>
                <Counter handleClick={this.handleClick} countNum={this.state.count} />
                <Stopwatch startFunction={() => app.start()} stopFunction={() => app.stop()} pauseFunction={() => app.changeState()} reset={() => this.showPopup("stop", "stop")} save={this.showPopup} ref={stopwatch => this.stopwatch = stopwatch}/>
                <FrequencyBars ref = {frequencyBars => {this.frequencyBars = frequencyBars}} />
            </div>
        )
    }
}

export default Record
