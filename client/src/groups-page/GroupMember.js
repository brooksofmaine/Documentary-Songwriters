import React from 'react';

class GroupMember extends React.Component {

    // TODO: make link to actual user page
    
    render() {
        return(
            <div className = "GroupMember">
                <p>
                    <span className = "MemberName">
                        <span style = {{display: this.props.creator ? 'inline' : 'none'}}>
                            Group Creator / 
                        </span>
                        <a href="/api/profile">
                            {this.props.name}
                        </a>
                    </span>
                </p>
                <p>Average Pitch Count Per Week: <b>{this.props.pitches}</b></p>
            </div>
        );
    };
}

export default GroupMember;