import React from 'react';

import userData2 from './userData2';  // temporary data
import PracticeBar from './PracticeBar';
import './UserProfile.css';

class UserProfile extends React.Component {
    constructor() {
        super();
    }

    async componentDidMount() {
        /*
        // will have username passed in as props (?)

        // get user
        await fetch('/api/user/{username}')
            .then(response => response.json())
            .then(data => {
                // get creation date of account
            })

        await fetch('/api/user/{username}/recordings?low=<lowBound>&high=<highBound>')
            // from creation date to now
            // convert times
            .then(response => response.json())
            .then(data => {
                // store these recordings then pass in where userData was
            })
        */
    }

    clickOption(option) {
        console.log("clicked " + option);
        if ( option === "all" ) {

        }
    }

    render() {

        // profile picture
        let proPic;
        userData2.picture ? 
            proPic = <img 
                        src = {userData2.picture}
                        className = "ProfilePicture"
                    /> :
            proPic = <div className = "NoProPic ProfilePicture"></div>;



        // finds unique instruments for string at top
        let uniqueInstruments = [];
        let flags             = [];
        let practices         = userData2.practices;
        practices.reverse();

        for ( let i = 0; i < practices.length; i++ ) {
            if ( !flags[practices[i].instrument] ) {
                flags[practices[i].instrument] = true;
                uniqueInstruments.push(practices[i].instrument);
            }
        }

        let playString = "Plays ";
        if ( uniqueInstruments.length == 0 ) {
            playString += "no instruments yet";
        }
        else if ( uniqueInstruments.length == 1 ) {
            playString += uniqueInstruments[0];
        }
        else if ( uniqueInstruments.length == 2 ) {
            playString += uniqueInstruments[0] + " and " + uniqueInstruments[1];
        } 
        else {
            for ( let i = 0; i < uniqueInstruments.length - 1; i++ ) {
                playString += uniqueInstruments[i] + ", "
            }
            playString += "and " + uniqueInstruments[uniqueInstruments.length - 1];
        }


        

        return(
            <div className = "Center GreyBackground">
                {proPic}
                <h4>{userData2.name}</h4>
                <p className = "InstrumentLine">{playString}</p>
                <div className = "Spacer"></div>
                <div className = "SmallSpacer"></div>
                <PracticeBar practices = {practices} instruments = {uniqueInstruments} />
                <div className = "Spacer"></div>
            </div>
        )
    }
}

export default UserProfile;
