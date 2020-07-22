import React from 'react'
import './Button.css'

class Button extends React.Component {
    render() {
        return (
            <a href={this.props.url}>
            <button id={this.props.id} 
                    onClick={this.props.onClick} 
                    className="Button Front">
                {this.props.name}
            </button>
            </a>
        );
    }
}

export default Button;
