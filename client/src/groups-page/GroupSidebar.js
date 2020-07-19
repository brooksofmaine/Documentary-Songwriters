import React from 'react';
import './Group.css';

/*
 * GroupSidebar
 * Mid-level component
 * Displays sidebar including names of all groups user is in, allowing them to be clicked on
 * Also displays button linking to create new group page
 * Child of Group
 */
function GroupSidebar(props) {
   return(
        <div className="GroupSideBar">
            <h3 className="BigName">My Groups</h3>
            {props.groupNames}
            <div className="ButtonContainer">
                <button className="GroupButton" onClick={() => window.location.href="/groups/new"}>
                    Create a Group
                </button>
            </div>
        </div>
    )
}

export default GroupSidebar;