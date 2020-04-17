import React from 'react';

import userData2 from './userData2';  // temporary data
import PracticeBar from './PracticeBar';
import './UserProfile.css';

import UserFunc from "../api-helper/user";
import RecordingFunc from "../api-helper/recording";

// TODO: profile landing page for no user?

class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username : this.props.match.params.username,
            firstName : "",
            lastName : "",
            createdAt : "",
            recordings : [],
        }
    }

    async componentDidMount() {

        await UserFunc.getUserInfo(this.state.username)
            .then(userInfo => {
                
                this.setState({
                    firstName : userInfo.firstName,
                    lastName : userInfo.lastName,
                    createdAt : userInfo.createdAt
                })
            })

        const msOfStartDate = Date.parse(this.state.createdAt);
        const startDate = new Date(msOfStartDate);
        const endDate = new Date();
        
        await RecordingFunc.getRecordings(
            null, 
            startDate,
            endDate
            )
            .then(recordings => {
                console.log(recordings)
                this.setState({
                    recordings : recordings
                })
            });
    }

    render() {

        // profile picture
        let proPic;
        userData2.picture ? 
            proPic = <img 
                        src={userData2.picture}
                        className="ProfilePicture"
                        alt="Profile avatar for user"
                    /> :
            proPic = <div className = "NoProPic ProfilePicture"></div>;



        // finds unique instruments for string at top
        let uniqueInstruments = [];
        let flags             = [];
        let practices         = this.state.recordings;

        for ( let i = 0; i < practices.length; i++ ) {
            if ( !flags[practices[i].instrument] ) {
                flags[practices[i].instrument] = true;
                uniqueInstruments.push(practices[i].instrument);
            }
        }

        console.log(uniqueInstruments);

        // sets string of instruments at top
        let playString = "Plays ";
        if ( uniqueInstruments.length == 0 ) {
            playString += "no instruments yet";
        }
        else if ( uniqueInstruments.length == 1 ) {
            playString = playString + uniqueInstruments[0].charAt(0).toLowerCase() 
                         + uniqueInstruments[0].slice(1);
        }
        else if ( uniqueInstruments.length == 2 ) {
            playString = playString + uniqueInstruments[0].charAt(0).toLowerCase() 
                         + uniqueInstruments[0].slice(1) + " and " 
                         + uniqueInstruments[1].charAt(0).toLowerCase()
                         + uniqueInstruments[1].slice(1);
        } 
        else {
            for ( let i = 0; i < uniqueInstruments.length - 1; i++ ) {
                playString = playString + uniqueInstruments[i].charAt(0).toLowerCase()
                             + uniqueInstruments[i].slice(1) + ", ";
            }
            playString = playString + "and " 
                         + uniqueInstruments[uniqueInstruments.length - 1].charAt(0).toLowerCase()
                         + uniqueInstruments[uniqueInstruments.length - 1].slice(1);
        }


        return(
            <div className = "Center GreyBackground">
                {proPic}
                <h4>{this.state.firstName} {this.state.lastName}</h4>
                <p className = "InstrumentLine">{playString}</p>
                <div className = "Spacer"></div>
                <div className = "SmallSpacer"></div>
                <PracticeBar 
                    practices = {practices} 
                    instruments = {uniqueInstruments} 
                />
                <div className = "Spacer"></div>
            </div>
        )
    }
}

export default UserProfile;
