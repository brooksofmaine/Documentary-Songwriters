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
            username: "",
            dayCount: 0,
            weekCount: 0,
            monthCount: 0
        };
    }

    componentDidMount() {
        UserFunc.getCurrentUser().then((user_info) => {
            console.log(user_info);
            console.log(user_info.status);
            if (user_info.status === "logged_in") {
                this.setState({"username": user_info.user.firstName + " " + user_info.user.lastName});
            }
        }).catch((err) => {
            console.log(err);
        });

        RecordingFunc.getPitchTotalCount(null, RecordingFunc.nthDayAgo(7), new Date()).then(result => {
            console.log("got week");
            this.setState({
                weekCount: result
            });
        });
        RecordingFunc.getPitchTotalCount(null, RecordingFunc.nthDayAgo(1), new Date()).then(result => {
            console.log("got day");
            this.setState({
                dayCount: result
            });
        });
        RecordingFunc.getPitchTotalCount(null, RecordingFunc.nthDayAgo(30), new Date()).then(result => {
            console.log("got month");
            this.setState({
                monthCount: result
            });
        });
    }

    render() {
        return (
            <div className="WelcomeBoard">
            <p className="welcome_back">Welcome Back, {this.state.username}</p>
                <h1 className="pitch_progress">Your Pitch Progress</h1>
                <div>
                    <WelcomeCounter count={this.state.dayCount} name="today"/>
                    <WelcomeCounter count={this.state.weekCount} name="this week"/>
                    <WelcomeCounter count={this.state.monthCount} name="this month"/>
                </div>
                <Button url="/api/record" name="Record" id="record-btn"/>
            </div>
        )
    }
}

export default WelcomeBoard
