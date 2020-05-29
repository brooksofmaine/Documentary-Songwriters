import React from "react";
import Counter from './Counter';
import Stopwatch from './Stopwatch';
import './Record.css';

import UserFunc from "../api-helper/user";
import InstrumentListener from '../pitch-counter/InstrumentListener.js';
import pitchCounter from '../pitch-counter/PitchCounter.js';
import app from '../pitch-counter/PitchCounterApp.js';
import RecordingFunc from "../api-helper/recording";
import RecordFilter from './RecordFilter';
import StopPopup from './StopPopup';
import SavePopup from './SavePopup';
import FrequencyBars from './FrequencyBars';


class Record extends React.Component {
    constructor() {
        super()

        this.selectedInstrument = "voice";
        app.change_instrument(this.selectedInstrument);
        
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

            removeMessage : "",
            lastPlayedInstrument : ""
        }

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

        let frequency = 16;

        this.frequency = setInterval(() => {
            if ( this.frequencyBars !== null ) {
                this.frequencyBars.updateFrequencyBars(app.instrument.pitchCounter.frequencyData);
                this.setState({
                    count: app.get_pitch_count()
                });
            }
        }, frequency);
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
        this.props.history.push("/api/profile");


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
                    <SavePopup exit = {this.removePopup} save = {this.saveRecording} instrument = {this.state.instrument} length = {this.state.length} pitches = {this.state.count}/>
                </div>
                <RecordFilter defaultInstrument = {this.state.lastPlayedInstrument} changeInstrument={() => this.showPopup("stop", "instrument")} ref = {filter => this.filter = filter}/>
                <Counter countNum={this.state.count} />
                <Stopwatch 
                    startFunction={() => app.start()}
                    stopFunction={() => app.stop()} 
                    pauseFunction={() => app.changeState()}
                    reset={() => this.showPopup("stop", "stop")} 
                    save={this.showPopup} 
                    ref={stopwatch => this.stopwatch = stopwatch}
                />
                <div className="RecordImages">
                    <svg width="1300" height="300" viewBox="0 0 1029 644" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M585.552 615.26C585.552 620.342 580.976 624.698 575.026 624.698C569.076 624.698 564.5 620.342 564.5 615.26C564.5 610.178 569.076 605.822 575.026 605.822C580.976 605.822 585.552 610.178 585.552 615.26Z" stroke="#8EACCD" stroke-width="3"/>
                        <line y1="-1.5" x2="45.7053" y2="-1.5" transform="matrix(0.375772 -0.926712 0.911702 0.410853 587.053 615.355)" stroke="#8EACCD" stroke-width="3"/>
                        <path d="M604.03 573L612.048 599.847" stroke="#8EACCD" stroke-width="2"/>
                        <ellipse cx="999.078" cy="632.137" rx="12.026" ry="10.9379" fill="black"/>
                        <line y1="-1.5" x2="45.7053" y2="-1.5" transform="matrix(0.375772 -0.926712 0.911702 0.410853 1011.1 632.232)" stroke="black" stroke-width="3"/>
                        <ellipse cx="975.026" cy="610.26" rx="12.026" ry="10.9379" fill="black"/>
                        <line y1="-1.5" x2="45.7053" y2="-1.5" transform="matrix(0.375772 -0.926712 0.911702 0.410853 987.053 610.356)" stroke="black" stroke-width="3"/>
                        <path d="M1004.03 568L1027.85 588.633" stroke="black" stroke-width="2"/>
                        <ellipse cx="624.553" cy="192.243" rx="17.1843" ry="12.8319" fill="black"/>
                        <line y1="-1.5" x2="55.42" y2="-1.5" transform="matrix(0.442827 -0.896607 0.937867 0.346995 641.738 192.354)" stroke="black" stroke-width="3"/>
                        <ellipse cx="590.184" cy="166.578" rx="17.1843" ry="12.8319" fill="black"/>
                        <line y1="-1.5" x2="55.42" y2="-1.5" transform="matrix(0.442827 -0.896607 0.937867 0.346995 607.37 166.69)" stroke="black" stroke-width="3"/>
                        <path d="M631.63 117L665.662 141.206" stroke="black" stroke-width="2"/>
                        <path d="M58.928 2.57433C128.464 29.0031 60.7148 45.9765 37.058 52.4969C37.058 52.4969 -1.70999 61.4328 3.6732 84.4306C8.83893 106.499 37.2288 115.015 39.514 115.667C39.6227 115.698 39.6983 115.715 39.8092 115.736C42.1583 116.172 71.5768 121.217 78.3725 101.571C81.506 94.7204 77.77 86.9354 72.788 81.3797C67.8059 75.824 54.6169 69.8715 47.6241 70.5339C40.6313 71.1962 29.7342 70.8814 25.6092 82.2961" stroke="#303D8B" stroke-width="5"/>
                        <path d="M58.2991 2.71286C58.2991 2.71286 41.5832 122.046 38.9334 144.259C36.2835 166.471 7.69449 150.377 7.26973 144.874" stroke="#303D8B" stroke-width="5"/>
                    </svg>
                </div>
                <FrequencyBars ref={frequencyBars => {this.frequencyBars = frequencyBars}} />
            </div>
        )
    }
}

export default Record;
