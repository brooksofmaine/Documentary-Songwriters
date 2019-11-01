import React from 'react';
import './WelcomeCounter.css'

class WelcomeCounter extends React.Component {
    render() {
        return (
            <p className="WelcomeCounter">
                <h1>{this.props.count}</h1>
                <p className="name">{this.props.name}</p>
            </p>
        )
    }
}

export default WelcomeCounter