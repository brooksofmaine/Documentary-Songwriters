import React from 'react';

import './StopPopup.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

class StopPopup extends React.Component {
    render() {
        return(
            <div className = "StopPopup">
                <FontAwesomeIcon icon = {faTimes} onClick = {() => this.props.noReset("stop")} className = "CornerX" />
                <p>Changing instruments in the middle of the recording will restart your recording without saving.</p>
                <p className = "Boldish">Are you sure you want to delete your recording?</p>
                <div onClick = {this.props.reset} className = "LightButton OptionButton">Yes</div>
                <div onClick = {() => this.props.noReset("stop")} className = "DarkButton OptionButton">No</div>
            </div>
        )
    }
}

export default StopPopup;