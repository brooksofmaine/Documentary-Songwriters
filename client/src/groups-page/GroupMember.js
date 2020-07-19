import React from 'react';

/*
 * GroupMember
 * Low-level component
 * Displays a single members name and information, and links to their profile
 * Child of GroupMemberContainer
 */
class GroupMember extends React.Component {
    render() {
        return(
            <div className = "GroupMember">
                <p>
                    <span className = "MemberName">
                        <a href={"/profile/" + this.props.name}>
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