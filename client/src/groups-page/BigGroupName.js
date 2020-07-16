import React from 'react';
import './Group.css';

/*
 * BigGroupName
 * Low-level component
 * Renders name of currently displayed group
 * Child of Group
 */
function BigGroupName(props) {
    return(
        <h2 className = "BigName">
            {props.groupName}
        </h2>
    )
}

export default BigGroupName;