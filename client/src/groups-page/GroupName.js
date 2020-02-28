import React from 'react';

import './GroupName.css';

class GroupName extends React.Component {

    render() {
        let style;
        this.props.active ? style = {fontWeight: 700} : style = {};

        return(
            <p 
                className = "GroupName" 
                style = {style}
                onClick = {() => 
                    this.props.activate(this.props.id)}
            >{this.props.title}
            </p>
        )
    }
}

export default GroupName;