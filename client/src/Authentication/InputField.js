import React from 'react'
import './InputField.css'

class InputField extends React.Component {
    render() {
        return (
            <p className="InputField">
                <span>{this.props.prompt}</span>
                <br/>
                <input type={this.props.type} placeholder={this.props.placeholder} id={this.props.id} name={this.props.name}/>
            </p>
        );
    }
}

export default InputField;
