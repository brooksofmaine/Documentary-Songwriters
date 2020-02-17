import React from 'react';

import userData from './userData';  // temporary data
import PracticeBar from './PracticeBar';
import './UserProfile.css';

class UserProfile extends React.Component {
    constructor() {
        super();
    }

    render() {

        // profile picture
        let proPic;
        userData.picture ? 
            proPic = <img 
                        src = {userData.picture}
                        className = "ProfilePicture"
                    /> :
            proPic = <div className = "NoProPic ProfilePicture"></div>;

        // instrument play string
        let playString = 'Plays ';
        for ( let i = 0; i < userData.instruments.length - 1; i++ ) {
            playString += userData.instruments[i].type;

            if ( userData.instruments.length > 2 ) {
                playString += ', ';
            }
            else {
                playString += ' ';
            }
        }
        playString += 'and ' + userData.instruments[userData.instruments.length - 1].type;

        // practice dropdowns
        const instrumentPractices = userData.instruments.map(instrument =>
            <PracticeBar 
                instrument = {instrument}
                className = "PracticeBar"
                key = {instrument.key}
            />);

        return(
            <div className = "Center">
                {proPic}
                <h4>{userData.name}</h4>
                <p>{playString}</p>
                <div className = "Spacer"></div>
                {instrumentPractices}
                <div className = "Spacer"></div>
            </div>
        )
    }
}

export default UserProfile;