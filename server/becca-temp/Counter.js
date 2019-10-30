import React from 'react';

class Counter extends React.Component {
    constructor() {
        super();
        this.state = {counter: 0};
    }

    render() {
        return(
            <div className="counterBox">
                <p className="pitchCounter">{this.props.count}</p>
            </div>
        )
    }
}

export default Counter;