import React from 'react';
import './Group.css';

/*
 * GroupDescription
 * Low-level component
 * Displays description of the current group
 * Child of Group
 */
function GroupDescription(props) {
    return(
        <p>
            {props.groupDescription}
        </p>
    )
}


export default GroupDescription;