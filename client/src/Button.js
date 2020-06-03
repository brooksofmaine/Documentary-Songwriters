import React from 'react'
import './Button.css'

class Button extends React.Component {
    render() {
        return (
            <button id={this.props.id} 
                    onClick={this.props.onClick} 
                    className="Button Front">
                <a href={this.props.url}>{this.props.name}</a>
            </button>
        );
    }
}

export default Button;
