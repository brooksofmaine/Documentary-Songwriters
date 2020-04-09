import React from "react"
import './InstrumentPage.css'


// Progress Bar
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import BarChart from 'react-bar-chart';
 



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

    const margin = {top: 20, right: 20, bottom: 30, left: 40};

    return(
        <div className="InstrumentPage">
            <div className="top-bar">
                <div className="pitch-progress section">
                    <h3 className="heading">Pitch Progress</h3>
                    <div className="data">
                        <p>Today</p>
                        <h3>{todayPitches}</h3>
                    </div>
                    <div className="data">
                        <p>This Week</p>
                        <h3>{weekPitches}</h3>
                    </div>
                    <div className="data">
                        <p>This Month</p>
                        <h3>{monthPitches}</h3>
                    </div>
                </div>
                <div className="achievements section">
                    <h3 className="heading">Your Achievements</h3>
                    <div className="row">
                        <CircularProgressbar className="progress-bar" maxValue={7} value={value} />
                        <p>You've practiced {value} out of 7 days this week! {messages[value]}</p>
                    </div>
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