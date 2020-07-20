import React from 'react';
import './GroupName.css';

/*
 * GroupName
 * Low-level component
 * Renders a single group's name 
 * Allows this name to be clicked and cause details to display
 * Child of GroupSidebar
 */
class GroupName extends React.Component {
    render() {
        let style;
        this.props.active ? style = {fontWeight: 700} : style = {};

        return(
            <p 
                className = "GroupName" 
                style = {style}
                onClick = {() => this.props.activate(this.props.id)}
            >{this.props.title}
            </p>
        )
    }
}

export default GroupName;