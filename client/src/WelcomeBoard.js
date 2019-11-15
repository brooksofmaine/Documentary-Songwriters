import React from 'react';
import './WelcomeBoard.css'
import WelcomeCounter from "./WelcomeCounter";
import Button from "./Button"

class WelcomeBoard extends React.Component {
    render() {
        return (
            <div className="WelcomeBoard">
            <p className="welcome_back">Welcome Back {this.props.username}</p>
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
