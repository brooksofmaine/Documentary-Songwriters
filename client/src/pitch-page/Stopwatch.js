import React from 'react';

import './Stopwatch.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPause, faPlay, faStop }
    from '@fortawesome/free-solid-svg-icons';

import ReactTooltip from 'react-tooltip';

/*
 * Stopwatch
 * Second-level component
 * Child of Record
 * Tracks timer, pausing, playing, etc. of the stopwatch for practices
 */
class Stopwatch extends React.Component {
    constructor() {
        super();
        this.state = {
            timerOn: false, // tracks if timer currently running
            timerStart: 0,  // tracks time that timer started
            timerTime: 0    // tracks time since timer started
        };

        this.startTimer = this.startTimer.bind(this);
        this.stopTimer  = this.stopTimer.bind(this);
        this.resetTimer = this.resetTimer.bind(this);
        this.playPause  = this.playPause.bind(this);
        this.stop       = this.stop.bind(this);
    };

    /*
     * Start timer
     * Alters state, updates timer times, starts pitch counter and timer
     * Called when user hits play button
     */
    startTimer = () => {
        this.props.startFunction();
        if ( ! this.state.timerOn ) {
            // begins timer
            // makes start time consistent even if recording's been paused
            this.setState({
                timerOn: true,
                timerStart: Date.now() - this.state.timerTime
            });
            // checks again every 1 second and updates run time
            this.timer = setInterval(() => {
                this.setState(({ timerTime }) => ({
                    timerTime: Date.now() - this.state.timerStart
                }));
            }, 1000);
        }
    };

    /*
     * Stop timer
     * Alters state, pauses pitch counter and timer
     * Called when user hits pause
     */
    stopTimer = () => {
        this.setState({
            timerOn: false
        });
        // stops sampling and updating times
        clearInterval(this.timer);
    };

    /*
     * Reset timer
     * Resets timer to 0, erases everything to date
     * Called when user hits stop
     */
    resetTimer = () => {
        this.setState({
            timerStart: 0,
            timerTime: 0
        });
    };

    /*
     * Play pause
     * Toggles play and pause functionality since play/pause button doubles
     * Decides if should play or pause then calls appropriate function
     * Called when user hits play/pause button
     */
    playPause = () => {
        this.props.pauseFunction()
        if ( this.state.timerOn ) {
            this.stopTimer();
        }
        else {
            this.startTimer();
        }
    };

    /*
     * Stop
     * Stops pitch counter and timer, and triggers warning popup if necessary
     * Called when user hits stop
     */
    stop = () => {
        this.props.stopFunction();
        this.props.reset("stop", "stop");
        // this.stopTimer();
        this.setState({
            timerOn: false
        });
        // stops sampling and updating times
        clearInterval(this.timer);
    };

    /*
     * Renders stopwatch counter and buttons to control it
     */
    render() {
        // makes timer (milliseconds) look nice
        const { timerTime } = this.state;
        let seconds = ("0" + (Math.floor(timerTime / 1000) % 60)).slice(-2);
        let minutes = ("0" + (Math.floor(timerTime / 60000) % 60)).slice(-2);
        let hours   = ("0" + Math.floor(timerTime / 3600000)).slice(-2);

        return (
            <div className = "Stopwatch">
                <div className="ButtonRow">
                    <div>
                        <button className="Button RecordButton" onClick={this.playPause}>
                            <FontAwesomeIcon icon={ this.state.timerOn ? faPause : faPlay } className="RecordIcon"/>
                        </button>
                    </div>
                    <div>
                        <button className="Button RecordButton" onClick={this.stop}>
                            <FontAwesomeIcon icon={faStop} className="RecordIcon" />
                        </button>
                    </div>
                    <div>
                        <button className="Button RecordButton" onClick={() => this.props.save("save")} data-tip="React-tooltip" >
                            <FontAwesomeIcon icon={faDownload} className="RecordIcon" />
                            <ReactTooltip className="Tooltip" effect="solid">
                                <span>Save Practice</span>
                            </ReactTooltip>
                        </button>
                    </div>
                </div>

                <div>
                    <div className="RecordDot"></div>
                    {hours} : {minutes} : {seconds}
                </div>
            </div>
        )
    };
}

export default Stopwatch;
