import React from 'react'
import './Button.css'

class Button extends React.Component {
    render() {
        return (
            // <button className="Button" onClick={() => {
            //     this.props.to ? 
            //     (location.href = this.props.to) : 
            //     this.props.onClick
            // }}>
            //     {this.props.name}
            // </button>
            // <p className="Button">
                <a className="Button" onClick={this.props.onClick} href={this.props.url}>{this.props.name}</a>
            // </p>
        );
    }
}

export default Button;
