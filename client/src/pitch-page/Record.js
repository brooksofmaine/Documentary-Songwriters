import React from "react";
import Counter from './Counter';
import Stopwatch from './Stopwatch';
import './Record.css';
import app from '../pitch-counter/app.js';
import RecordingFunc from "../api-helper/recording";

import RecordFilter from './RecordFilter';
import StopPopup from './StopPopup';
import SavePopup from './SavePopup';

// Function to pause: change_state

// import PitchCounter  from '../../server/pitch-counter/pitch_counter'


class Record extends React.Component {
    constructor() {
        super()
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
            pitches : 250
        }

        this.handleClick = this.handleClick.bind(this);
        this.restart = this.restart.bind(this);
        this.removePopup = this.removePopup.bind(this);
        this.showPopup = this.showPopup.bind(this);
        this.saveRecording = this.saveRecording.bind(this);
        this.prettyTime = this.prettyTime.bind(this);
    }

    componentDidMount() {
        this.interval = setInterval(() => this.setState({ 
            count: app.get_pitch_count(),
            instrument : this.filter.state.instrument,
            length : this.prettyTime(this.stopwatch.state.timerTime)
            // TODO: update pitches
        }), 500); 
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

    showPopup(popup) {
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
        // TODO: integrate actual recording into post to database -- how does this work? will they be able to replay it?
        // TODO: fix start and end times
        // TODO: fix connection error? (recording.js:137)
        const temp = new Date();
        RecordingFunc.newRecording(
            this.state.pitches,     // pitches
            this.state.instrument,  // instrument
            description,            // description
            temp,                   // start time
            temp                    // end time
            );


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
                    <StopPopup reset = {this.restart} noReset = {this.removePopup}/>
                </div>
                <div style = {this.state.saving ? {} : {display : "none"}} ref = {filterContainer => this.filterContainer = filterContainer}>
                    <SavePopup exit = {this.removePopup} save = {this.saveRecording} instrument = {this.state.instrument} length = {this.state.length} pitches = {this.state.pitches}/>
                </div>
                <RecordFilter changeInstrument={() => this.showPopup("stop")} ref = {filter => this.filter = filter}/>
                <Counter handleClick={this.handleClick} countNum={this.state.count} />
                <Stopwatch startFunction={() => app.start()} stopFunction={() => app.stop()} save={this.showPopup} ref={stopwatch => this.stopwatch = stopwatch}/>
            </div>
        )
    }
}

export default Record