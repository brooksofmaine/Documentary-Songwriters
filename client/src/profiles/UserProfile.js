import React, { useState, useEffect } from 'react';
import PracticeBar from './PracticeBar';
import './UserProfile.css';
import UserFunc from "../api-helper/user";
import RecordingFunc from "../api-helper/recording";
import { lowerFirstLetter } from './capitalization';
import userData2 from './userData2';  // temporary data

function UserProfile(props) {

    const [username]                    = useState(props.match.params.username); // from query string
    const [firstName, setFirstName]     = useState("");      // first name of curr user
    const [lastName, setLastName]       = useState("");      // last name of curr user
    const [createdAt, setCreatedAt]     = useState("");      // date curr user account created
    const [recordings, setRecordings]   = useState([]);      // array of all user's practices
    const [proPic, setProPic]           = useState(null);    // src of user profile pic
    const [instruments, setInstruments] = useState([]);      // array of unique instruments
    const [playString, setPlayString]   = useState("");      // string of what instruments played
    const [initialized, setInitialized] = useState(false);   // bool if data done initializing
    
    // initializes user data once
    useEffect(() => {
        
        // helper function to get user info from database
        async function getUserInfo() {
            await UserFunc.getUserInfo(username)
                .then(userInfo => {
                    setFirstName(userInfo.firstName);
                    setLastName(userInfo.lastName);
                    setCreatedAt(userInfo.createdAt);
                });
        }

        // helper function to get recordings of user
        async function getRecordings() {
            const msOfStartDate = Date.parse(createdAt);
            const startDate     = new Date(msOfStartDate);
            const endDate       = new Date();
            
            await RecordingFunc.getRecordings(
                null, 
                startDate,
                endDate
                )
                .then(practices => {
                    setRecordings(practices);
                    setInitialized(true);
                });   
        }
        

        // call above functions
        if ( !initialized ) {
            getUserInfo();
            getRecordings();
        } 
    }, [username, createdAt, recordings, initialized])
    
    // initializes secondary user characteristics once
    useEffect(() => {
        
        // currently not implenting profile pictures--can add in later
        // helper function to set profile picture
        // function setProfilePic() {
        //     let pic; // TEMPORARY
        //     userData2.picture ? 
        //         pic = <img 
        //                 src={userData2.picture}
        //                 className="ProfilePicture"
        //                 alt="Profile avatar for user"
        //             /> :
        //         pic = <div className = "NoProPic ProfilePicture"></div>;
        //         setProPic(pic);
        // }

        // helper function to identify played instruments
        function setUniqueInstruments() {
            let uniqueInstruments = [];
            let flags             = [];
    
            for ( let i = 0; i < recordings.length; i++ ) {
                if ( !flags[recordings[i].instrument] ) {
                    flags[recordings[i].instrument] = true;
                    uniqueInstruments.push(recordings[i].instrument);
                }
            }
            setInstruments(uniqueInstruments);
        }

        // helper function to create "plays" string
        function setInstrumentString() {
            let plays = "Plays ";
            if ( instruments.length === 0 ) {
                plays += "no instruments yet";
            }
            else if ( instruments.length === 1 ) {
                plays += lowerFirstLetter(instruments[0]);
            }
            else if ( instruments.length === 2 ) {
                plays += lowerFirstLetter(instruments[0]) + " and " 
                            lowerFirstLetter(instruments[1]);
            } 
            else {
                for ( let i = 0; i < instruments.length - 1; i++ ) {
                    plays += lowerFirstLetter(instruments[i]) + ", ";
                }
                plays += "and " + lowerFirstLetter(instruments[instruments.length - 1]);
            }
    
            setPlayString(plays);
        }
        
        // sets data using above functions
        // setProfilePic();
        setUniqueInstruments();
        setInstrumentString();
    }, [recordings])
    
    return(
        <div className = "Center GreyBackground">
            <h4>{firstName} {lastName}</h4>
            <p className = "InstrumentLine">{playString}</p>
            <div className = "Spacer"></div>
            <div className = "SmallSpacer"></div>
            <PracticeBar
                practices = {recordings} 
                instruments = {instruments} 
            />
            <div className = "Spacer"></div>
        </div>
    )
}

export default UserProfile;
