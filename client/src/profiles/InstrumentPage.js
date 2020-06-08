import React, { useState, useEffect } from "react"
import './InstrumentPage.css'

import UserFunc from "../api-helper/user";
import RecordingFunc from "../api-helper/recording";

import ProgressCircle from "./ProgressCircle"
import ProgressGraph from "./ProgressGraph"
import ProfileSidebar from './ProfileSidebar';



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

    // Change to be zero once API call exists to get recordingGoal
    const [recordingGoal, setRecordingGoal] = useState(100);
    const [percentage, setPercentage] = useState(0);



    useEffect(() => {
        UserFunc.getCurrentUser().then((user_info) => {
            if (user_info.status === "logged_in") {
                setUsername(user_info.user.username);
            }

        }).catch((err) => {
            console.log(err);
        });
        
}, [])

    useEffect(() => {
        if (username != "") {
            RecordingFunc.getPitchTotalCount(username,
                RecordingFunc.nthDayAgo(1),
                new Date()).then(
                    result => {
                        setTodayPitches(result);
                    }
                );
            RecordingFunc.getPitchTotalCount(username,
                RecordingFunc.nthDayAgo(7),
                new Date()).then(
                result => {
                    setWeekPitches(result);
                }
            );
            RecordingFunc.getPitchTotalCount(username,
                RecordingFunc.nthDayAgo(30),
                new Date()).then(
                result => {
                    setMonthPitches(result);
                }
            );
            // TODO: Set recording goal here
            
        }
    }, [username])


    useEffect(() => {
        if (recordingGoal != 0) {
            setPercentage((weekPitches / recordingGoal).toFixed(2) * 100);
        }
        
    }, [recordingGoal, weekPitches])


    const margin = { top: 20, right: 20, bottom: 30, left: 40 };


    return (
        <div className="InstrumentPage">
            <ProfileSidebar />
            <div className="Progress">
                <div className="top-bar">
                    <div className="pitch-progress section">
                        <h3 className="heading">Pitch Progress</h3>
                        <div className="data">
                            <div className="row">
                                <p>Today</p>
                                <h3>{todayPitches}</h3>
                            </div>
                            <hr />
                            <div className="row">
                                <p>This Week</p>
                                <h3>{weekPitches}</h3>
                            </div>
                            <hr />
                            <div className="row">
                                <p>This Month</p>
                                <h3>{monthPitches}</h3>
                            </div>
                        </div>

                    </div>
                    <div className="achievements section">
                        <h3 className="heading">Your Achievements</h3>
                        <div className="row">
                            <ProgressCircle percentage={percentage} /> 
                            <p>You've played {weekPitches} pitches this week. You have {recordingGoal - weekPitches} pitches until you reach your weekly goal!</p>
                        </div>


                    </div>
                </div>
                <div className="progress-report section">

                    <ProgressGraph username={username}/>


                </div>
            </div>    

        </div>
    )
}

export default InstrumentPage