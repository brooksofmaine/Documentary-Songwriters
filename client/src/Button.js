import React from 'react'
import './Button.css'

class Button extends React.Component {
    render() {
        return (
            <p className="Button">
                <a href={this.props.url}>{this.props.name}</a>
            </p>
        );
    }
}

export default Button;
