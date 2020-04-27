import React, {useState, useEffect} from "react"
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip, BarChart, Bar} from 'recharts';
// import CanvasJSReact from '../assets/canvasjs/canvasjs.react';
import './ProgressGraph.css'
import RecordingFunc from "../api-helper/recording";

function ProgressGraph(props) {
    const [isBarChart, setIsBarChart] = useState(false);
    const [data, setData] = useState([
        {day: 'Sunday'},
        {day: 'Monday'},
        {day: 'Tuesday'},
        {day: 'Wednesday'},
        {day: 'Thursday'},
        {day: 'Friday'},
        {day: 'Saturday'}, 
    ])



    const renderLineChart = async () => {
        var data = [
            {day: 'Sunday'},
            {day: 'Monday'},
            {day: 'Tuesday'},
            {day: 'Wednesday'},
            {day: 'Thursday'},
            {day: 'Friday'},
            {day: 'Saturday'}, 
        ]

        var d = new Date()
        var dayOfWeek = d.getDay() // Returns 0-6
        console.log("Day of week is ", dayOfWeek)
        for (var i = 0; i <= dayOfWeek; i++) {
            const dayPitches = await RecordingFunc.getPitchTotalCount("peter", RecordingFunc.nthDayAgo(i+1), RecordingFunc.nthDayAgo(i))
            data[dayOfWeek-i].pitches = dayPitches
            console.log(`Adding ${dayPitches} to ${data[dayOfWeek-i].day}`)
        }
        
        return data
    }

    const returnBars = data.map((day) => <Bar dataKey="pitches" />)

    useEffect(async () => {
        const data = await renderLineChart();
        console.log("Data:", data)
        setData(data);
    }, [])


    return (
        <div className="ProgressGraph">
            <button onClick={() => {setIsBarChart(!isBarChart)}}>isBarChart</button>
            <ResponsiveContainer width="100%" height={300}>
                {!isBarChart ?
                <LineChart width={400} height={400} data={data}>
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

