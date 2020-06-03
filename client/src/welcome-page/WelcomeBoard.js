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
        return (
            <div className="WelcomeBoard">
            <p className="welcome_back">Welcome Back, {this.state.user_fullname}</p>
                <h1 className="pitch_progress">Your Pitch Progress</h1>
                <div>
                    <WelcomeCounter count={this.state.dayCount} name="today"/>
                    <WelcomeCounter count={this.state.weekCount} name="this week"/>
                    <WelcomeCounter count={this.state.monthCount} name="this month"/>
                </div>
                <Button url="/api/practice" name="Practice" id="record-btn"/>
            </div>
        )
    }
}

export default WelcomeBoard
