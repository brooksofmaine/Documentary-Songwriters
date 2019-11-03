import React from 'react';
import './WelcomeBoard.css'
import WelcomeCounter from "./WelcomeCounter";
import Button from "./Button"

class WelcomeBoard extends React.Component {
    render() {
        return (
            <div>
            <div className="WelcomeBoard">
                <p className="welcome_back">Welcome Back</p>
                <h1 className="pitch_progress">Your Pitch Progress</h1>
                <p>
                    <WelcomeCounter count="32" name="today"/>
                    <WelcomeCounter count="50" name="this week"/>
                    <WelcomeCounter count="106" name="this month"/>
                </p>
                <p style={{marginTop: "30px"}}><Button url="/api/record" name="Record"/></p>
            </div>
            </div>
        )
    }
}

export default WelcomeBoard
