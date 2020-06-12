import React from 'react';
import './WelcomeCounter.css'

/*
 * Low-level component 
 * Displays a single counter on homepage
 * Child of WelcomeBoard
 */ 
class WelcomeCounter extends React.Component {
    render() {
        return (
            <div className="WelcomeCounter">
                <h1>{this.props.count}</h1>
                <p className="name">{this.props.name}</p>
            </div>
        )
    }
}

export default WelcomeCounter