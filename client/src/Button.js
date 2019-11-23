import React from 'react'
import './Button.css'

class Button extends React.Component {
    render() {
        return (
            <div id={this.props.id} className="Button" onClick={this.props.onClick}>
                <a href={this.props.url} >{this.props.name}</a>
            </div>
        );
    }
}

export default Button;
