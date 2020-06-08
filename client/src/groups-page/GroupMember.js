import React from 'react';

class GroupMember extends React.Component {

    // TODO: make link to actual user page
    
    render() {
        return(
            <div className = "GroupMember">
                <p>
                    <span className = "MemberName">
                        <a href={"/api/profile/" + this.props.name}>
                            {this.props.name}
                        </a>
                    </span>
                </p>
                <p>Weekly Pitch Count: <b>{this.props.pitches}</b></p>
            </div>
        );
    };
}

export default GroupMember;