import React from 'react';
import Button from './Button';

import './Stopwatch.css';
import Play from './play.png';
import Pause from './pause.png';
import Stop from './stop.png';
import Share from './share.png';

class Stopwatch extends React.Component {
    constructor() {
        super();
        this.state = {
            timerOn: false,
            timerStart: 0,
            timerTime: 0
        };

        this.startTimer = this.startTimer.bind(this);
        this.stopTimer  = this.stopTimer.bind(this);
        this.resetTimer = this.resetTimer.bind(this);
        this.playPause  = this.playPause.bind(this);
        this.stop       = this.stop.bind(this);
    };

    // on play
    startTimer = () => {
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

    // pauses timer
    stopTimer = () => {
        this.setState({
            timerOn: false
        });
        // stops sampling and updating times
        clearInterval(this.timer);
    };

    // resets timer to zero
    resetTimer = () => {
        this.setState({
            timerStart: 0,
            timerTime: 0
        });
    };

    // controls play and pause
    playPause = () => {
        if ( this.state.timerOn ) {
            this.stopTimer();
        }
        else {
            this.startTimer();    
        }
    };

    // on stop
    stop = () => {
        this.stopTimer();
        this.resetTimer();
    };

    render() {
        const { timerTime } = this.state;
        let seconds = ("0" + (Math.floor(timerTime / 1000) % 60)).slice(-2);
        let minutes = ("0" + (Math.floor(timerTime / 60000) % 60)).slice(-2);
        let hours   = ("0" + Math.floor(timerTime / 3600000)).slice(-2);

        return (
            <div className = "Stopwatch">
                <div className="ButtonRow">
                    <div className="ButtonBox">
                        <button className="Button" onClick={this.playPause}>
                            <img className={ this.state.timerOn ? "Pause" : "Play" } src={ this.state.timerOn ? Pause : Play } />
                        </button>
                    </div>
                    <div className="ButtonBox">
                        <button className="Button" onClick={this.stop}>
                            <img className="Stop" src={ Stop } />
                        </button>
                    </div>
                    <div className="ButtonBox">
                        <button className="Button">
                            <img className="Share" src={ Share } />
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