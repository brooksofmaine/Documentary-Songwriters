import React from "react"
import Counter from './Counter'
import Stopwatch from './Stopwatch'
import './Record.css';


// import PitchCounter  from '../../server/pitch-counter/pitch_counter'


class Record extends React.Component {
    constructor() {
        super()
        this.state = {
            count: 0
        }
        
        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount() {
        // const script1 = document.createElement("script")
        // script1.src = './pitch-counter/tuner.js'
        // document.body.appendChild(script1)
        
        const app = require('./pitch-counter/pitch_counter.js')
        app.start()
        console.log("Pitch count: ", app.get_pitch_count())
        
        

    }
    // Temporary function--only used to demonstrate counter 
    // component
    handleClick() {
        console.log(window.app.get_pitch_count())
        
        this.setState((state, props) => ({
            count: state.count + 1
        }))
    }

    render() {
        return(
            <div className="Record">
                <Counter handleClick={this.handleClick} countNum={this.state.count} />
                <Stopwatch/>
            </div>
        )
    }
}

export default Record