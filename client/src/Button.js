import React from 'react'
import './Button.css'

class Button extends React.Component {
    render() {
        return (
            <p id={this.props.id} className="Button">
                <a href={this.props.url} onClick={this.props.onClick}>{this.props.name}</a>
            </p>
        );
    }
}

export default Button;
