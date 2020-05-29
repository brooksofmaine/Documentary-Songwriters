import React, { useState, useEffect } from "react"

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './ProgressCircle.css'

function ProgressCircle(props) {
    // var percentage = 0;
    // const value = 0.33;

    const [percentage, setPercentage] = useState(0);
    // Animate bar
    useEffect(() => {
        const timer = setTimeout(() => {
            setPercentage(props.percentage);
        }, 20);
        return () => clearTimeout(timer);
    }, [props.percentage]);
    return (
        <div className="ProgressCircle">
            <CircularProgressbar
                value={percentage}
                text={`${percentage}%`}
                strokeWidth={2.5}
            />
        </div>
    )
}

export default ProgressCircle