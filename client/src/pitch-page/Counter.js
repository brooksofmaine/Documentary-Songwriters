import React from 'react';
import './Counter.css';

class Counter extends React.Component {
    constructor() {
        super();
        this.state = {counter: 0};
    }

    render() {
        return(
            <div className = "counterContainer">
                <h3 className="Heading">Pitch Counter</h3>
                <div onClick={this.props.handleClick} className="counterBox">
                    <p className="pitchCounter">{this.props.countNum}</p>
                </div>
            </div>
        )
    }
}

export default Counter;