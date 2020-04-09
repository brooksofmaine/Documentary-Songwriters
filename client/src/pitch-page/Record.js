import React from "react"
import Counter from './Counter'
import Stopwatch from './Stopwatch'
import './Record.css';
import InstrumentListener from '../pitch-counter/InstrumentListener.js'
import PitchCounter from '../pitch-counter/PitchCounter.js'
import app from '../pitch-counter/PitchCounterApp.js'

// Function to pause: change_state

// import PitchCounter  from '../../server/pitch-counter/pitch_counter'


class Record extends React.Component {
    constructor() {
        super()

        this.selectedInstrument = "voice";
        app.change_instrument(this.selectedInstrument)
        
        this.state = {
            count: 0
        }

        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.setState({ count: app.get_pitch_count() });
            console.log("Pitch count: " + this.state.count)
        }, 500);

    }

    // Temporary function--only used to demonstrate counter 
    // component
    handleClick() {
        // console.log(app.get_pitch_count())
        // this.setState((state, props) => ({
        //     count: app.get_pitch_count()
        // }))

    }

    render() {
        return(
            <div className="Record">
                <Counter handleClick={this.handleClick} countNum={this.state.count} />
                <Stopwatch startFunction={() => app.start()} stopFunction={() => app.stop()}/>
            </div>
        )
    }
}

export default Record