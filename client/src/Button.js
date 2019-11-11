import React from 'react'
import './Button.css'

class Button extends React.Component {
    render() {
        return (
                <a className="Button" id={this.props.id} onClick={this.props.onClick} href={this.props.url}>{this.props.name}</a>

        );
    }
}

export default Button;
