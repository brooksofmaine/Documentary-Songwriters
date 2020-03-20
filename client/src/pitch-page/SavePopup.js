import React from 'react';

import './SavePopup.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

class SavePopup extends React.Component {
    constructor() {
        super();
        this.state = {
            description : ""
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const {name, value} = event.target;
        this.setState({
            [name] : value
        });
    }
    
    render() {
        return(
            <div className = "SavePopup">
                <FontAwesomeIcon icon = {faTimes} onClick = {() => this.props.exit("save")} className = "CornerX" />
                <h3 className = "RecordHeading">{this.props.instrument}</h3>
                <p className = "SaveInline">{this.props.length}</p>
                <p className = "SaveInline">{this.props.pitches}</p>
                <div>
                    <input 
                        type = "text"
                        name = "description"
                        onChange = {this.handleChange}
                        value = {this.state.description}
                        placeholder = "Add a description"
                        className = "SaveInput" 
                    />
                </div>
                <div onClick = {() => this.props.save(this.state.description)} className = "DarkButton OptionButton">Save</div>
            </div>
        )
    }
}

export default SavePopup;