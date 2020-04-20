import React, {useState} from "react"
import './InstrumentPage.css'

import UserFunc from "../api-helper/user";
import RecordingFunc from "../api-helper/recording";

import BarChart from 'react-bar-chart';
import ProgressCircle from "./ProgressCircle"
import ProgressGraph from "./ProgressGraph"



{/* <BarChart ylabel='Pitches'
                    width={600}
                    height={400}
                    margin={margin}
                    data={data}
                    onBarClick={handleBarClick}/> */}
function InstrumentPage(props) {
    const [username, setUsername] = useState("");
    const [todayPitches, setTodayPitches] = useState(0);
    const [weekPitches, setWeekPitches] = useState(0);
    const [monthPitches, setMonthPitches] = useState(0);
    
    UserFunc.getCurrentUser().then((user_info) => {
        if (user_info.status === "logged_in") {
            setUsername(user_info.user);
            
            RecordingFunc.getPitchTotalCount("peter",
                RecordingFunc.nthDayAgo(1),
                new Date()).then(
                result => {
                    setTodayPitches(result);
                }
            );

            RecordingFunc.getPitchTotalCount("peter",
                RecordingFunc.nthDayAgo(7),
                new Date()).then(
                result => {
                    setWeekPitches(result);
                }
            );

            

            RecordingFunc.getPitchTotalCount("peter",
                RecordingFunc.nthDayAgo(30),
                new Date()).then(
                result => {
                    setMonthPitches(result);
                }
            );
        } 
    }).catch((err) => {
        console.log(err);
    });

    // var value = 5;

    // const messages = ['Great start!', 'Keep it up!', 'Keep it up!', 'Keep it up!', 'Nearly a perfect week!', 'Nearly a perfect week!', 'A perfect week!']


    // Bar chart data
    // function handleBarClick(element, id){ 
    //     console.log(`The bin ${element.text} with id ${id} was clicked`);
    // }

    // const data = [
    //     {text: 'Sun', value: 50}, 
    //     {text: 'Mon', value: 150}, 
    //     {text: 'Tues', value: 75}, 
    //     {text: 'Weds', value: 0},
    //     {text: 'Thurs', value: 0},
    //     {text: 'Fri', value: 0},
    //     {text: 'Sat', value: 0},
    //   ];

    const percentage = 66;

    const margin = {top: 20, right: 20, bottom: 30, left: 40};

    return(
        <div className="InstrumentPage">
            <div className="top-bar">
                <div className="pitch-progress section">
                    <h3 className="heading">Pitch Progress</h3>
                    <div className="data">
                        <div className="row">
                            <p>Today</p>
                            <h3>{todayPitches}</h3>
                        </div>
                        <hr/>
                        <div className="row">
                            <p>This Week</p>
                            <h3>{weekPitches}</h3>
                        </div>
                        <hr/>
                        <div className="row">
                            <p>This Month</p>
                            <h3>{monthPitches}</h3>
                        </div>
                    </div>
                    
                </div>
                <div className="achievements section">
                    <h3 className="heading">Your Achievements</h3>
                    <div className="row">
                        <ProgressCircle percentage={66}/>
                        <p>You've played {} pitches this week. You have {} until you reach your weekly goal!</p>
                    </div>
                    
                    
                </div>
            </div>
            <div className="progress-report section">
                    
                    <ProgressGraph />
                    
                    
                </div>
           
        </div>
    )
}

export default InstrumentPage