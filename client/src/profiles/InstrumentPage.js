import React from "react"
import './InstrumentPage.css'


// Progress Bar
// import 'react-circular-progressbar/dist/styles.css';

import BarChart from 'react-bar-chart';
 
import ProgressCircle from "./ProgressCircle"


function InstrumentPage(props) {
    const todayPitches = 0;
    const weekPitches = 0;
    const monthPitches = 0;

    var value = 5;

    const messages = ['Great start!', 'Keep it up!', 'Keep it up!', 'Keep it up!', 'Nearly a perfect week!', 'Nearly a perfect week!', 'A perfect week!']


    // Bar chart data
    function handleBarClick(element, id){ 
        console.log(`The bin ${element.text} with id ${id} was clicked`);
    }

    const data = [
        {text: 'Sun', value: 50}, 
        {text: 'Mon', value: 150}, 
        {text: 'Tues', value: 75}, 
        {text: 'Weds', value: 0},
        {text: 'Thurs', value: 0},
        {text: 'Fri', value: 0},
        {text: 'Sat', value: 0},
      ];

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
                        <ProgressCircle percentage={66}/>
                        <p>You've played {} pitches this week. You have {} until you reach your weekly goal!</p>
                    
                </div>
            </div>
            <div className="progress-report section">
                    <BarChart ylabel='Pitches'
                    width={600}
                    height={400}
                    margin={margin}
                    data={data}
                    onBarClick={handleBarClick}/>
                </div>
           
        </div>
    )
}

export default InstrumentPage