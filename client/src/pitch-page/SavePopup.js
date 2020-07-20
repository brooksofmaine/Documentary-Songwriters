import React from 'react';

import './SavePopup.css';
import '../Forms.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

/*
 * SavePopup
 * Mid-level component
 * Child of Record
 * Displays (sometimes hidden) popup to allow user to save their practice
 */
class SavePopup extends React.Component {
    constructor() {
        super();
        this.state = {
            description : "" // user-written description of practice
        }

        this.handleChange = this.handleChange.bind(this);
    }

    /*
     * Handle change
     * Called on change to description text input field
     * Updates state for single point of truth
     */
    handleChange(event) {
        const {name, value} = event.target;
        this.setState({
            [name] : value
        });
    }
    
    /*
     * Renders text, input field, and buttons for save popup
     * Clicking save button calls save function from props in Record.js
     */
    render() {
        return(
            <div className = "SavePopup">
                <FontAwesomeIcon icon = {faTimes} onClick = {() => this.props.exit("save")} className = "CornerX" />
                <h3 className = "RecordHeading">{this.props.instrument}</h3>
                <p className = "SaveInline">{this.props.length}</p>
                <p className = "SaveInline">{this.props.pitches}</p>
                <div>
                    <label className="Label SaveLabel">Practice Description</label>
                    <br />
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