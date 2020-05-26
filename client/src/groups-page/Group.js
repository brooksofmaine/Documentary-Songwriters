import React from 'react';

import GroupMember from './GroupMember';
import GroupName from './GroupName';

import './Group.css';

import groupData from './groupData'; // this is temporary data
import GroupFunc, { getGroup } from '../api-helper/group.js'
import UserFunc from '../api-helper/user.js';
import {server_add} from "../api-helper/config";
// button at bottom should link to make a group page
class Group extends React.Component {
    constructor() {
        super();
        this.state = {
            currGroup : 0
        }
        this.showGroup = this.showGroup.bind(this);
        this.getGroups = this.getGroups.bind(this);
    }

    showGroup(key) {
        this.setState({currGroup : key - 1});
    }

    componentDidMount() {
        this.getGroups();
        
        // TODO: get people in each group
        // TODO: get weekly pitches for people in each group
        // TODO: render only one group at a time
    }

    // This isn't returning groups that the user is currently in
    async getGroups() {
        
        let username, groups, data;
        username = await UserFunc.getCurrentUsername()
        console.log(username)
        data  = await UserFunc.getGroups(username)
        groups = data.Groups;
        console.log(groups);

        let groupInfo = new Array();
        let currGroupInfo;
        for (let i = 0; i < groups.length; i++) {
        
            currGroupInfo = await GroupFunc.getGroup(groups[i].groupName);
            console.log(currGroupInfo)
            // currGroupInfo = 
        }

    }

    render() {
        const groups = groupData.map(group => 
            ({id: group.id,
              title: group.title,
              members: group.members
            }));

        const groupNames = groups.map(group => 
            <GroupName 
                id={group.id}
                title={group.title}
                activate={this.showGroup}
                active={this.state.currGroup === group.id - 1 ? true : false}
            />);
        
        let memberComponents;

        // these will potentially eventually be links to profiles
        memberComponents = groups[this.state.currGroup]
                           .members.map(member => 
            <GroupMember 
                key={member.id} 
                name={member.name} 
                pitches={member.pitches} 
                creator={member.creator} 
            />);

        return(
            <div>
                <div className = "GroupSideBar">
                    <h3 className = "BigName">My Groups</h3>
                    {groupNames}
                    <div className = "ButtonContainer">
                        <button className= "GroupButton" onClick={() => window.location.href="/api/groups/new"}>
                            Create a Group
                        </button>
                    </div>
                </div>
                <h2 className = "BigName">
                    {groups[this.state.currGroup].title}
                </h2>
                <div className = "MemberBox">
                    {memberComponents}
                </div>
            </div>
        );
    };
}

export default Group;