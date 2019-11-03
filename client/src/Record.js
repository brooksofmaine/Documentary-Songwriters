import React from "react"
import Counter from './Counter'
import Stopwatch from './Stopwatch'
import './Record.css';

class Record extends React.Component {
    constructor() {
        super()
        this.state = {
            count: 0
        }

        this.handleClick = this.handleClick.bind(this)
    }
    // Temporary function--only used to demonstrate counter 
    // component
    handleClick() {
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