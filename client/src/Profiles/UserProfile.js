import React, { useState, useEffect } from 'react';
import PracticeBar from './PracticeBar';
import './UserProfile.css';
import UserFunc from "../api-helper/user";
import RecordingFunc from "../api-helper/recording";

const lowerFirstLetter = (word) => {
    return word.charAt(0).toLowerCase() + word.slice(1);
}

/*
 * UserProfile
 * Top level component rendered at /api/profile/:username
 * Intended mostly to display filterable past practices
 * Visible to the public, not just the current user
 * Potential TODO: Add profile picture to user table in database and display here
 */

function UserProfile(props) {

    const [username]                    = useState(props.match.params.username); // from query string
    const [firstName, setFirstName]     = useState("");      // first name of curr user
    const [lastName, setLastName]       = useState("");      // last name of curr user
    const [createdAt, setCreatedAt]     = useState("");      // date curr user account created
    const [recordings, setRecordings]   = useState([]);      // array of all user's practices
    const [instruments, setInstruments] = useState([]);      // array of unique instruments that user has played
    const [playString, setPlayString]   = useState("");      // string of what instruments the user plays to display at top
    const [initialized, setInitialized] = useState(false);   // bool if data done initializing
    const [maxPitches, setMaxPitches] = useState(100); 
    
    /*
     * Initializes all user to data to be used on this page
     */
    useEffect(() => {
        
        /*
         * Helper function to get user info from database
         * Retrieves first name, last name, and creation date
         */
        async function getUserInfo() {
            await UserFunc.getUserInfo(username)
                .then(userInfo => {
                    setFirstName(userInfo.firstName);
                    setLastName(userInfo.lastName);
                    setCreatedAt(userInfo.createdAt);
                });
        }

        /*
         * Helper function to get recordings of user
         */
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
        
        /* 
         * Main to call above functions
         */
        if ( !initialized ) {
            getUserInfo();
            getRecordings();
            
        } 

        /*
         * Calculate max pitches user has ever played in a recording
         * Uses this info in filter
         */
        if (initialized) {
            let max = 100;
            
            for (let recording of recordings) {
                if (recording.numPitches > max) {
                    max = recording.numPitches;
                }
            }
            setMaxPitches(max);
        }
    }, [username, createdAt, recordings])
    
    /*
     * Initializes secondary user characteristics once
     * Called once practices are initialized
     * Includes unique instruments (for filter) and instrument string (at top of page)
     */
    useEffect(() => {
        
        /* 
         * Helper function to identify all unique played instruments
        */
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

        /*
         * Helper function to create "plays" string
         */
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
        
        /*
         * Main part of function which sets data using above functions
         */
        setUniqueInstruments();
        setInstrumentString();
    }, [recordings])
    
    /* 
     * Display including name, play string, collapsible filter, practices
     * Does NOT include sidebar (if applicable)
     */
    return(
        <div className = "Center GreyBackground">
            <div className="UserProfileSpacer"></div>
            <h4>{firstName} {lastName}</h4>
            <p className = "InstrumentLine">{playString}</p>
            <div className = "Spacer"></div>
            <div className = "SmallSpacer"></div>
            <PracticeBar
                practices = {recordings} 
                instruments = {instruments} 
                maxPitches={maxPitches}
            />
            <div className = "Spacer"></div>
        </div>
    )
}

export default UserProfile;
