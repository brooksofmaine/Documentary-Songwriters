import React from 'react';
import './WelcomeBoard.css'
import WelcomeCounter from "./WelcomeCounter";
import Button from "../Button"
import WelcomeImage from './WelcomeImage';

import UserFunc from "../api-helper/user";
import RecordingFunc from "../api-helper/recording";

/*
 * Top-level component for homepage
 * Displayed at /api/home
 */
class WelcomeBoard extends React.Component {
    constructor() {
        super();
        this.state = {
            user: null,     // user object
            dayCount: 0,    // pitches today
            weekCount: 0,   // pitches in last week
            monthCount: 0   // pitches in last month
        };
    }

    /*
     * Ensures currently logged in and retrieves user data
     * Counts up daily, weekly, and monthly pitches to display
     * Called when component mounts
     */
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

    /*
     * Renders entire homepage including username and pitch counters
     */
    render() {
        const name = this.state.user ? this.state.user.firstName + " " + this.state.user.lastName : ""
        
        return (
            <div className="WelcomeBoard">
                <div className="Front">
                    <p className="welcome_back">Welcome Back, {name}</p>
                    <h1 className="pitch_progress">Your Pitch Progress</h1>
                    <div>
                        <WelcomeCounter count={this.state.dayCount} name="today"/>
                        <WelcomeCounter count={this.state.weekCount} name="this week"/>
                        <WelcomeCounter count={this.state.monthCount} name="this month"/>
                    </div>
                    <Button url="/api/practice" name="Practice" id="record-btn"/>
                </div>
                <WelcomeImage />
            </div>
        )
    }
}

export default WelcomeBoard;
