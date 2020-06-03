import React from 'react';
import './WelcomeBoard.css'
import WelcomeCounter from "./WelcomeCounter";
import Button from "../Button"

import UserFunc from "../api-helper/user";
import RecordingFunc from "../api-helper/recording";
import GroupFunc from "../api-helper/group";

class WelcomeBoard extends React.Component {
    constructor() {
        super();
        this.state = {
            user: null,
            dayCount: 0,
            weekCount: 0,
            monthCount: 0
        };
    }

    componentDidMount() {
        UserFunc.getCurrentUser().then((user_info) => {
            if (user_info.status === "logged_in") {
                this.setState({"user": user_info.user});

                RecordingFunc.getPitchTotalCount(this.state.user.username,
                    RecordingFunc.nthDayAgo(7),
                    new Date()).then(
                    result => {
                        this.setState({
                            weekCount: result
                        });
                    }
                );

                RecordingFunc.getPitchTotalCount(this.state.user.username,
                    RecordingFunc.nthDayAgo(1),
                    new Date()).then(
                    result => {
                        this.setState({
                            dayCount: result
                        });
                    }
                );

                RecordingFunc.getPitchTotalCount(this.state.user.username,
                    RecordingFunc.nthDayAgo(30),
                    new Date()).then(
                    result => {
                        this.setState({
                            monthCount: result
                        });
                    }
                );

                
            } else {
                window.location = "/";
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    render() {
        const name = this.state.user ? this.state.user.firstName + " " + this.state.user.lastName : ""
        
        return (
            <div className="WelcomeBoard">
                <p className="welcome_back">Welcome Back, {name}</p>
                <h1 className="pitch_progress">Your Pitch Progress</h1>
                <div>
                    <WelcomeCounter count={this.state.dayCount} name="today"/>
                    <WelcomeCounter count={this.state.weekCount} name="this week"/>
                    <WelcomeCounter count={this.state.monthCount} name="this month"/>
                </div>
                <Button url="/api/practice" name="Practice" id="record-btn"/>
                <div className="WelcomeBoardImage">
                    <svg width="350" height="550" viewBox="0 0 638 795" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="3" y1="-3" x2="193.605" y2="-3" transform="matrix(0 -1 0.999991 0.00413698 36 496.605)" stroke="#303D8B" stroke-width="6" stroke-linecap="round"/>
                        <line x1="3" y1="-3" x2="393.029" y2="-3" transform="matrix(0 -1 0.999996 0.00272677 76 596.029)" stroke="#303D8B" stroke-width="6" stroke-linecap="round"/>
                        <path d="M116 654.704L116 142" stroke="#303D8B" stroke-width="6" stroke-linecap="round"/>
                        <line x1="3" y1="-3" x2="638.344" y2="-3" transform="matrix(0 -1 0.999982 0.00601243 156 718.344)" stroke="#303D8B" stroke-width="6" stroke-linecap="round"/>
                        <line x1="3" y1="-3" x2="726.036" y2="-3" transform="matrix(0 -1 0.999938 0.0111689 196 762.036)" stroke="#303D8B" stroke-width="6" stroke-linecap="round"/>
                        <line x1="3" y1="-3" x2="790.795" y2="-3" transform="matrix(0 -1 0.999853 0.0171578 236 794.795)" stroke="#303D8B" stroke-width="6" stroke-linecap="round"/>
                        <line x1="3" y1="-3" x2="669.376" y2="-3" transform="matrix(0 -1 1 0.00055581 276 734.376)" stroke="#303D8B" stroke-width="6" stroke-linecap="round"/>
                        <line x1="3" y1="-3" x2="503.209" y2="-3" transform="matrix(0 -1 0.999998 0.00216012 316 651.209)" stroke="#303D8B" stroke-width="6" stroke-linecap="round"/>
                        <line x1="3" y1="-3" x2="311.402" y2="-3" transform="matrix(0 -1 0.999995 0.00325468 356 555.402)" stroke="#303D8B" stroke-width="6" stroke-linecap="round"/>
                        <line x1="3" y1="-3" x2="186.564" y2="-3" transform="matrix(0 -1 0.999983 0.00576814 396 492.563)" stroke="#303D8B" stroke-width="6" stroke-linecap="round"/>
                        <line x1="3" y1="-3" x2="86.7989" y2="-3" transform="matrix(0 -1 0.999528 0.0307279 436 446.799)" stroke="#303D8B" stroke-width="6" stroke-linecap="round"/>
                        <path d="M477.42 537.251L476 258" stroke="#303D8B" stroke-width="6" stroke-linecap="round"/>
                        <line x1="3" y1="-3" x2="405.794" y2="-3" transform="matrix(0 -1 0.99999 0.00435621 517.42 602.794)" stroke="#303D8B" stroke-width="6" stroke-linecap="round"/>
                        <line x1="3" y1="-3" x2="147" y2="-3" transform="matrix(0 -1 0.999995 -0.00312854 598 473)" stroke="#303D8B" stroke-width="6" stroke-linecap="round"/>
                        <line x1="3" y1="-3" x2="189.953" y2="-3" transform="matrix(0 -1 0.999995 -0.00312854 558 492.953)" stroke="#303D8B" stroke-width="6" stroke-linecap="round"/>
                        <line x1="3" y1="-3" x2="207" y2="-3" transform="matrix(0 -1 0.999995 -0.00312854 638 501)" stroke="#303D8B" stroke-width="6" stroke-linecap="round"/>
                    </svg>
                </div>
            </div>
        )
    }
}

export default WelcomeBoard;
