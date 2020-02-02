import React from 'react';
import './WelcomeBoard.css'
import WelcomeCounter from "./WelcomeCounter";
import Button from "./Button"

import UserFunc from "./api-helper/user";

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
        });
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
