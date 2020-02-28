import React from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import './NewMember.css';

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