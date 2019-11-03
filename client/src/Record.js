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
    }

    render() {
        return(
            <div className="Record">
                <Counter count={this.state.count} />
                <Stopwatch/>
            </div>
        )
    }
}

export default Record