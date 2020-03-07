import React from 'react';
import './Counter.css';

class Counter extends React.Component {
    constructor() {
        super();
        this.state = {
            counter    : 0,
            instrument : 'Piano'
        };
    }

    render() {
        const instruments = ['Piano', 'Guitar', 'Flute', 'Drums', 'Cello']; // check back for Adam's instruments
        // choose appropriate pitch counter based on that
        
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