import React from 'react';

class GroupMember extends React.Component {

    render() {
        return(
            <div className = "GroupMember">
                <p><span className = "MemberName"><span style = {{display: this.props.creator ? 'inline' : 'none'}}>Group Creator / </span>{this.props.name}</span></p>
                <p>Average Pitch Count Per Week: <b>{this.props.pitches}</b></p>
            </div>
        );
    };
}

export default GroupMember;