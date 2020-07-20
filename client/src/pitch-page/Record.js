import React from "react";
import Counter from './Counter';
import Stopwatch from './Stopwatch';
import './Record.css';

import UserFunc from "../api-helper/user";
import {app} from '../pitch-counter/PitchCounterApp.js';
import RecordingFunc from "../api-helper/recording";
import RecordFilter from './RecordFilter';
import StopPopup from './StopPopup';
import SavePopup from './SavePopup';
import FrequencyBars from './FrequencyBars';
import RecordImages from './RecordImages';

/*
 * Record
 * Top-level component holding entire page with pitch counter display
 * Allows for instrument filtering, pause, play, stop, and save
 * Displayed at /practice
 */
class Record extends React.Component {
    constructor() {
        super();

        this.selectedInstrument = "voice"; // default to voice
        app.change_instrument(this.selectedInstrument);
        
        this.state = {
            count: 0,                   // counts pitches played
            overlayStyle : {            // controls overlay that covers page when
                width: 0,               // save or stop popups are present
                height: 0
            },
            stopping : false,           // bool for if currently stopped recording
            saving : false,             // bool for if currently saving recording
            instrument : "Voice",       // current instrument
            length : 0,                 // length of recording displayed nicely

            removeMessage : "",         // message displayed on the cautionary popup
            lastPlayedInstrument : ""   // instrument this user most recently played
        }

        this.restart = this.restart.bind(this);
        this.removePopup = this.removePopup.bind(this);
        this.showPopup = this.showPopup.bind(this);
        this.saveRecording = this.saveRecording.bind(this);
        this.prettyTime = this.prettyTime.bind(this);
    }

    /*
     * Called when component mounts
     * Grabs user instrument data
     * Initializes and updates timer display (interval)
     * Updates frequency bar display (interval)
     */
    async componentDidMount() {
        let username;
        let instrument;

        // collects username of current user and their most recently played instrument
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
                lastPlayedInstrument : "Voice"
            })
        }

        // updates time on stopwatch every second and displays it nicely
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

        // updates frequency bars every fraction of a second to match pitch currently sounding
        let frequency = 16;

        this.frequency = setInterval(() => {
            if ( this.frequencyBars !== null && this.stopwatch.state.timerOn) {
                this.frequencyBars.updateFrequencyBars(app.instrument.pitchCounter.frequencyData);
            }
            this.setState({
                count: app.get_pitch_count()
            });
        }, frequency);
    }

    /*
     * Restart
     * Allows reseting the counter and timer when user decides to stop practice
     * Called from stop popup when user tries to stop or change instrument mid-practice
     */
    restart() {
        // changes instrument on front and back end if that was reason for stop
        let newInstrument = this.filter.state.pendingInstrument
        if (newInstrument !== "") {
            this.filter.changeInstrument();
            app.change_instrument(newInstrument);
        }
        
        this.removePopup("stop");
        this.stopwatch.resetTimer("stop");
    }

    /*
     * Show Popup
     * Un-hides popup to give user information
     * Called when user tries to save or stop practice, or change instrument mid-practice
     * popup parameter: "stop" or "save" for which popup to display
     * reason parameter: "instrument" or "stop"
     *                   instrument: changing instrument in middle of practice
     *                   stop: stopping practice
     */
    showPopup(popup, reason) {
        // pauses stopwatch
        this.stopwatch.stopTimer();
        this.frequencyBars.eraseBars();

        if ( popup === "stop" ) {
            // only ask about restart if actually recorded anything or changed instrument
            if ( this.stopwatch.state.timerTime > 0 ) {
                this.setState({
                    stopping : true,
                    overlayStyle: {       // changes overlay to become visible
                        width  : "105%",  
                        height : "110vh"
                    }
                });
                
                // sets appropriate cautionary message to render to user
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
            else if (reason === "instrument") {
                this.filter.changeInstrument();
                app.change_instrument(this.filter.state.pendingInstrument);
            }
        }
        // save
        else { 
            this.setState({
                saving : true,          // makes overlay visible
                overlayStyle: {
                    width  : "105%",
                    height : "110vh"
                }
            })
        }
    }

    /*
     * Remove popup
     * Re-hides popup that was displayed
     * popup parameter: "stop" or "save"
     */
    removePopup(popup) {
        if ( popup === "stop" ) {
            this.setState({
                stopping : false
            });
            // clears pending instrument regardless of reason for stop
            this.filter.clearPending();
        }
        else {
            this.setState({
                saving : false
            });
        }

        // re-hides overlay
        this.setState({
            overlayStyle : {
                width: 0,
                height: 0
            }
        });
    }

    /*
     * Save recording
     * Called when user hits save button
     * description parameter: description user wrote for this practice
     * Saves practice to database using API helper
     * Redirects user to progress page upon success
     */
    saveRecording(description) {
        // calculate start and end times
        const now = Date.now();
        const endTime = new Date(now);
        const startTime = new Date(now - this.stopwatch.state.timerTime);

        RecordingFunc.newRecording(
            this.state.count,       // pitches
            this.state.instrument,  // instrument
            description,            // description
            startTime,              // start time
            endTime                 // end time
            ).then(err => console.log(err))

        // TODO: handle errors somehow
        this.props.history.push("/api/profile");

    }

    /*
     * Pretty time
     * Helper function to grab time and display it nicely 
     * milliseconds parameter: milliseconds to display in hours, min, and secs
     * Returns string displayed nicely
     */
    prettyTime(milliseconds) {

        let seconds = ("0" + (Math.floor(milliseconds / 1000) % 60)).slice(-2);
        let minutes = ("0" + (Math.floor(milliseconds / 60000) % 60)).slice(-2);
        let hours   = ("0" + Math.floor(milliseconds / 3600000)).slice(-2);

        return hours + " : " + minutes + " : " + seconds;
    }

    /*
     * Renders overlay, popups (maybe hidden), filter, counter, stopwatch, graphics, and frequency bars
     */
    render() {
        return(
            <div className="Record">
                <div className="RecordOverlay" style={this.state.overlayStyle}></div>
                <div style = {this.state.stopping ? {} : {display: "none"}}>
                    <StopPopup reset = {this.restart} noReset = {this.removePopup} message = {this.state.removeMessage} />
                </div>
                <div style = {this.state.saving ? {} : {display : "none"}} ref = {filterContainer => this.filterContainer = filterContainer}>
                    <SavePopup exit = {this.removePopup} save = {this.saveRecording} instrument = {this.state.instrument} length = {this.state.length} pitches = {this.state.count}/>
                </div>
                <RecordFilter 
                    defaultInstrument = {this.state.lastPlayedInstrument} 
                    changeInstrument={() => this.showPopup("stop", "instrument")} 
                    stopFunction={() => app.stop()} 
                    ref = {filter => this.filter = filter}/>
                <Counter countNum={this.state.count} />
                <Stopwatch 
                    startFunction={() => app.start()}
                    stopFunction={() => app.stop()} 
                    pauseFunction={() => app.changeState()}
                    reset={() => this.showPopup("stop", "stop")}
                    save={this.showPopup} 
                    ref={stopwatch => this.stopwatch = stopwatch}
                />
                <RecordImages />
                <FrequencyBars ref={frequencyBars => {this.frequencyBars = frequencyBars}} />
            </div>
        )
    }
}

export default Record;
