import React from "react"
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

function ProgressCircle(props) {
    const percentage = 66;
    const value = 0.33;
    return(
        <CircularProgressbar value={percentage}/>
    )
}

export default ProgressCircle