import React from 'react';
import './NewGroup.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch} from '@fortawesome/free-solid-svg-icons';

/*
 * NewGroupBox
 * Mid-level component
 * Renders input fields and list of to-be-added members
 * Allows parent to handle logic and API functionality
 * Child of NewGroup
 */
function NewGroupBox(props) {
    const userStyle  = props.badUser ? { color: '#f00' } : { color: '#000' };
    const groupStyle = props.badGroup ? { color: '#f00' } : { color: '#000' };

    const userErrorStyle  = props.badUser ? { display : 'block' } : { display : 'none' };
    const groupErrorStyle = props.badGroup ? { display : 'block' } : { display : 'none' };
    
    return(
        <div className="GroupBox">
            <form>
                <label className="Label LightLabel">Group Name</label>
                <div className="InputWrapper">  
                    <input 
                        type="text" 
                        name="groupName"
                        onChange={props.handleChange}
                        value={props.groupName}
                        placeholder="Name"
                        className="GroupFormText"
                        style={groupStyle}
                    />
                </div>
                <div className="ErrorMessage" style={groupErrorStyle}>
                    {props.groupErrorMessage}
                </div>

                <label className="Label LightLabel">Group Description</label>
                <div className="InputWrapper">  
                    <input 
                        type="text" 
                        name="description"
                        onChange={props.handleChange}
                        value={props.description}
                        placeholder="Description"
                        className="GroupFormText"
                    />
                </div>

                <label className="Label LightLabel">Enter username of a user to invite</label>
                <div className="InputWrapper">
                    <input 
                        type="text" 
                        name="currMember"
                        onChange={props.handleChange}
                        value={props.currMember}
                        onKeyPress={props.handleClick}
                        placeholder="Username"
                        className="GroupFormText"
                        id="EnterUsername"
                        style={userStyle}
                    />
                    <span><FontAwesomeIcon icon={faSearch} className="SearchIcon" onClick={props.addMember}/></span>
                </div>
                <div className="ErrorMessage" style={userErrorStyle}>
                    {props.userErrorMessage}
                </div>

                <div className="NewGroupMemberBox">
                    {props.newMembers}
                </div>
                <div className="ButtonBox">
                    <button 
                        className="GroupButton" 
                        onClick={props.createGroup}>Create Group</button>
                </div>
            </form>
        </div>
    )
}

export default NewGroupBox;
