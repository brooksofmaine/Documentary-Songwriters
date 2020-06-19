import React, {useState, useEffect} from "react"
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip, BarChart, Bar} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChartBar, faChartLine} from '@fortawesome/free-solid-svg-icons'
import './ProgressGraph.css'
import RecordingFunc from "../api-helper/recording";
import UserFunc from "../api-helper/user";

function ProgressGraph(props) {
    const [isBarChart, setIsBarChart] = useState(false);
    const [curr, setCurr] = useState(new Date())
    const [data, setData] = useState([
        {day: 'Sun'},
        {day: 'Mon'},
        {day: 'Tues'},
        {day: 'Weds'},
        {day: 'Thurs'},
        {day: 'Fri'},
        {day: 'Sat'} 
    ])

    const renderLineChart = async () => {
        var data = [
            {day: 'Sun'},
            {day: 'Mon'},
            {day: 'Tues'},
            {day: 'Weds'},
            {day: 'Thurs'},
            {day: 'Fri'},
            {day: 'Sat'} 
        ]

        const userInfo = await UserFunc.getCurrentUser()
        // console.log("User Info:", userInfo)
        var d = new Date()
        const dayOfWeek = d.getDay()
        const daysFromCurrent = Math.round((d.getTime() - curr.getTime()) / (1000 * 3600 * 24))
        if (daysFromCurrent === 0) {
            for (var i = 0; i <= d.getDay(); i++) {
                const dayPitches = await RecordingFunc.getPitchTotalCount(userInfo.user.username, RecordingFunc.nthDayAgo(i+1), RecordingFunc.nthDayAgo(i))
                // if (!dayPitches) {
                //     data[dayOfWeek-i].pitches = 0
                // } else {
                    // console.log(`dayPitches for ${i} is ${dayPitches}`)
                    data[dayOfWeek-i].pitches = dayPitches
                // }
            }
            return data
        } else if (daysFromCurrent > 0) {
            for (var i = 0; i < 7; i++) {
                const dayPitches = await RecordingFunc.getPitchTotalCount(userInfo.user.username, RecordingFunc.nthDayAgo(i+1+daysFromCurrent), RecordingFunc.nthDayAgo(i+daysFromCurrent))
                data[i].pitches = dayPitches
            }
            return data
        } else {
            return data
        }
    }

    useEffect(() => {
        const setChartData = async () => {
            const renderingData = await renderLineChart();
            setData(renderingData);
        }
        setChartData()
    }, [curr])

    const buttonStyle = (buttonNum) => {
        const shadowStyle = {"boxShadow": "0 1px 4px 1px rgba(0,0,0,0.17)"}
        if (isBarChart) {
            if (buttonNum == 0) {
                return ({})
            } else {
                return shadowStyle
            }
        } else {
            if (buttonNum == 0) {
                return shadowStyle
            } else {
                return ({})
            }
        }
    }
    // Helper function 
    const addDays = (date, days) => {
        const copy = new Date(Number(date))
        copy.setDate(date.getDate() + days)
        return copy;
    }

    const returnDateString = () => {
        if (curr) {
            const currDay = curr.getDay();
            const start = addDays(curr, (0 - currDay))
            const end = addDays(curr, (7 - currDay))
            return ( `${start.toLocaleString('default', {month: 'short'})} ${start.getDate()} - ${end.toLocaleString('default', {month: 'short'})} ${end.getDate()}`)
        } else {
            return ""
        }
    }

    return (
        <div className="ProgressGraph">
            <div className="title-bar">
                <div className="row">
                    <h3 className="heading">Progress Report</h3>
                    <div className="graph-bar">
                       <button className="graph-button" onClick={() => {setIsBarChart(false)}}>
                        <span className="btn-content" tabIndex="-1" style={buttonStyle(0)} >
                            <FontAwesomeIcon icon={faChartBar} />
                        </span>
                    </button>
                    <button className="graph-button" onClick={() => {setIsBarChart(true)}}>
                        <span tabIndex="-1" className="btn-content" style={buttonStyle(1)} >
                            <FontAwesomeIcon icon={faChartLine} />
                        </span>
                    </button> 
                    </div>
                    
                </div>
                <div className="dates">
                    <button 
                        className="date-btn"
                        onClick={() => {setCurr(addDays(curr, -7))}}>&lt;</button>
                    <h4 className="date-string">{returnDateString()}</h4>
                    <button 
                        className="date-btn"
                        onClick={() => {setCurr(addDays(curr, 7))}}>&gt;</button>
                </div>
            </div>
            
            <ResponsiveContainer width="100%" height={300} className="graph">
                {!isBarChart ?
                <LineChart width={500} height={400} data={data}>
                    <Line type="monotone" 
                        dataKey="pitches" 
                        isAnimationActive={false}
                        stroke="#8884d8" 
                        />
                    <CartesianGrid stroke="#ccc" />
                    <YAxis dataKey="pitches" />
                    <XAxis dataKey="day" />
                    <Legend />
                    <Tooltip />
                </LineChart> :
                <BarChart data={data}>
                    <Bar dataKey="pitches" 
                         fill="#8EACCD"
                         radius={[5, 5, 0, 0]} />
                    {/* <CartesianGrid stroke="#ccc" /> */}
                    <YAxis dataKey="pitches" />
                    <XAxis dataKey="day" />
                    <Legend />
                    <Tooltip cursor={false}/>
                </BarChart>
                }
                
                
            </ResponsiveContainer>
        </div>
    )
}

export default ProgressGraph

