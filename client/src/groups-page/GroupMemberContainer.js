import React from 'react';
import './Group.css';
import '../Forms.css';

/*
 * GroupMemberContainer
 * Mid-level component
 * Displays all the current members and buttons to add new member or leave group
 * Child of Group
 */
function GroupMemberContainer(props) {
    // sets styles of add user field based on whether there's an error
    const userStyle  = props.badUser ? { color: '#f00' } : { color: '#000' };
    const userErrorStyle = props.badUser ? { display : 'block' } : { display : 'none' };
    
    return(
        <div className = "MemberContainer">
            <div className="MemberBox">
                {props.members}
            </div>
            <div className="MemberButtonContainer">
                <form className="GroupsForm" onSubmit={props.addMember} style={props.buttonStyle}>
                    <label className="Label LightLabel">Username</label>
                    <input
                        type="text"
                        name="newMember"
                        onChange={props.handleChange}
                        value={props.newMember}
                        placeholder="Enter username"
                        className="NewMemberInput"
                        style={userStyle}
                    />
                    <div className="ErrorMessage" style={userErrorStyle}>
                        {props.errorMessage}
                    </div>
                </form>
                <div className="MemberButtonColumn" style={props.buttonStyle}>
                    <button className= "GroupButton" onClick={props.addMember}>
                        Add Member
                    </button>
                </div>
                <div className="MemberButtonColumn" style={props.buttonStyle}>
                    <button className= "GroupButton" onClick={props.leaveGroup}>
                        Leave Group
                    </button>
                </div>
            </div>
        </div>
    )
}

export default GroupMemberContainer;