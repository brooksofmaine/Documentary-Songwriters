import React from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import './NewMember.css';

/*
 * NewMember
 * Low-level component 
 * Displays a to-be-added member and allows it to be deleted
 * Delete functionality handled through props function in parent
 * Child of NewGroupBox
 */
class NewMember extends React.Component {
    render() {
        return(
            <div className = "NewMember" onClick = {() => this.props.deleteMe(this.props.id)}>
                {this.props.name}
                <FontAwesomeIcon icon={faTimes} className = "MemberX"/>
                <br />
            </div>
        )
    }
}

export default NewMember;