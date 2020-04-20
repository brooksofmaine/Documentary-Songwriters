import React from "react"
import CanvasJSReact from '../assets/canvasjs/canvasjs.react';
import './ProgressGraph.css'

function ProgressGraph(props) {
    var CanvasJS = CanvasJSReact.CanvasJS;
    var CanvasJSChart = CanvasJSReact.CanvasJSChart;

    CanvasJS.addColorSet("customColors", ["#8EACCD"]);
    
    const options = {
        axisY:{
            gridThickness: 0,
          },
        data: [{
            type: "column",
            dataPoints: [
                { label: "Sunday", y: 10 },
                { label: "Monday", y: 15 },
                { label: "Tuesday", y: 25 },
                { label: "Wednesday", y: 30 },
                { label: "Thursday", y: 0 },
                { label: "Friday", y: 0 },
                { label: "Saturday", y: 0 }
            ]
        }], 
        dataPointWidth: 19,
        colorSet:"customColors"
    }

    return (
        <div className="ProgressGraph">
            <CanvasJSChart options={options}
            /* onRef = {ref => this.chart = ref} */
            />
        </div>
    )
}

export default ProgressGraph