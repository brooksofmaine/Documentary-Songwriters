import React from 'react';
import './Counter.css';

/*
 * Counter
 * Displays number of pitches in the practice and counts up via props
 * Child of Record
 * Low-level component 
 */
class Counter extends React.Component {
    constructor() {
        super();
        this.state = {
            counter    : 0,      // number of pitches in this practice
            instrument : 'Piano' // currently selected instrument
        };
    }

    /* 
     * Renders current number of pitches to display
     */
    render() {
        return(
            <div className="counterContainer">
                <div className="counterBox">
                    <p className="pitchCounter">{this.props.countNum}</p>
                </div>
            </div>
        )
    }
}

export default Counter;