import React from 'react';
import './WelcomeBoard.css'
import WelcomeCounter from "./WelcomeCounter";
import Button from "./Button"

import UserFunc from "./api-helper/user";
import RecordingFunc from "./api-helper/recording";
import GroupFunc from "./api-helper/group";

class WelcomeBoard extends React.Component {
    constructor() {
        super();
        this.state = {"username": ""};
        UserFunc.getCurrentUser().then((user_info) => {
            console.log(user_info);
            console.log(user_info.status);
            if (user_info.status === "logged_in") {
                this.setState({"username": user_info.user.firstName + " " + user_info.user.lastName});
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    componentDidMount(): void {
        console.log("------- BEGIN TESTING --------");
        UserFunc.getUserInfo("123").then((result, err) => {
            console.log(result);
        });

        const old_date = new Date();
        old_date.setHours(old_date.getHours() - 1);
        const date2 = new Date();
        RecordingFunc.newRecording(10, "Piano", "Some description", old_date.toISOString(), old_date.toISOString()).then((result) => {
            console.log("RESULT: ", result);
        });

        RecordingFunc.getRecordings(null, old_date.toISOString(), old_date.toISOString())

    }

    render() {
        return (
            <div className="WelcomeBoard">
            <p className="welcome_back">Welcome Back, {this.state.username}</p>
                <h1 className="pitch_progress">Your Pitch Progress</h1>
                <div>
                    <WelcomeCounter count="32" name="today"/>
                    <WelcomeCounter count="50" name="this week"/>
                    <WelcomeCounter count="106" name="this month"/>
                </div>
                <Button url="/api/record" name="Record" id="record-btn"/>
            </div>
        )
    }
}

export default WelcomeBoard
