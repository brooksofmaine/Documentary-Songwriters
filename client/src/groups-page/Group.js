import React from 'react';

import GroupMember from './GroupMember';
import GroupName from './GroupName';

import './Group.css';

import GroupFunc from '../api-helper/group.js'
import UserFunc from '../api-helper/user.js';
import RecordingFunc from '../api-helper/recording.js';
import {server_add} from "../api-helper/config";
// button at bottom should link to make a group page
class Group extends React.Component {
    constructor() {
        super();
        this.state = {
            username: "",
            
            currGroup : 0,
            groupsInfo: null,
            groupNames: null,

            newMember: "",
            badUser: false,
            errorMessage: ""
        }
        this.showGroup = this.showGroup.bind(this);
        this.getGroups = this.getGroups.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addMember = this.addMember.bind(this);
        this.leaveGroup = this.leaveGroup.bind(this);
    }

    showGroup(key) {
        this.setState({currGroup : key});
    }

    componentDidMount() {
        this.getGroups();
    }

    async getGroups() {
        
        let username, groups, data;
        username = await UserFunc.getCurrentUsername()
        this.setState({
            username: username
        });
        data  = await UserFunc.getGroups(username)
        groups = data.Groups;

        let tempGroupsInfo = new Array();
        let groupsInfo = new Array();
        let groupNames = new Array();
        let memberUsername, memberPitches;
        let oneGroupInfo = new Array();

        for (let i = 0; i < groups.length; i++) {
        
            tempGroupsInfo[i] = await GroupFunc.getMembers(groups[i].groupName);
            oneGroupInfo.splice(0);

            for (let j = 0; j < tempGroupsInfo[i].length; j++) {
                memberUsername = tempGroupsInfo[i][j].username;
                memberPitches = await RecordingFunc.getPitchTotalCount(memberUsername,
                    RecordingFunc.nthDayAgo(7),
                    new Date());
                
                oneGroupInfo[j] = {
                    username: memberUsername,
                    pitches: memberPitches
                };
            }
            groupNames[i] = {
                name: groups[i].groupName,
                description: groups[i].description,
                id: i
            };
            groupsInfo[i] = oneGroupInfo.slice();
            
        }
        this.setState({
            groupsInfo: groupsInfo,
            groupNames: groupNames
        })
    }

    handleChange(event) {
        const {name, value} = event.target;
        this.setState({
            [name] : value
        });

        if ( name === 'newMember' ) {
            this.setState({
                badUser : false
            });
        }
    }

    addMember(event) {
        event.preventDefault();

        fetch('/api/user/' + this.state.newMember)
            .then(response => response.json())
            .then(data => {
                console.log(data);

                let alreadyAdded = false;
                const members = this.state.groupsInfo[this.state.currGroup];
                console.log(members)

                for ( let i = 0; i < members.length; i++ ) {
                    
                    if ( members[i].username === this.state.newMember ) {
                        alreadyAdded = true;
                        break;
                    }
                }

                if ( data.err ) {
                    this.setState({
                        badUser : true,
                        errorMessage : 'No user with this username exists'
                    });
                }
                else if ( alreadyAdded ) {
                    this.setState({
                        badUser : true,
                        errorMessage : 'This user has already been added'
                    }); 
                }
                else {
                    // TODO: add user to group in database
                    GroupFunc.addMember(this.state.groupNames[this.state.currGroup].name,
                                        this.state.newMember);
                    this.getGroups();
                    this.setState({
                        newMember: ""
                    })
                }

            });
    }

    async leaveGroup() {
        const groupName = this.state.groupNames[this.state.currGroup].name;
        GroupFunc.removeMember(groupName, this.state.username).then(response => console.log(response));

        // if now no longer in any groups
        if (this.state.groupNames.length - 1 === 0) {
            this.setState({
                groupsInfo: null,
                groupNames: null
            });
        }
        // if there are still remaining groups
        else {
            this.setState({
                currGroup: 0
            });
        }
        this.getGroups();
    }

    render() {

        let groupNames;
        if (this.state.groupNames !== null) {
            groupNames = this.state.groupNames.map(object => 
                <GroupName
                    id={object.id}
                    title={object.name}
                    activate={() => this.showGroup(object.id)}
                    active={this.state.currGroup === object.id ? true : false}
                />);
        }
        
        
        let memberComponents;

        if (this.state.groupsInfo !== null && this.state.groupsInfo.length > this.state.currGroup) {
            memberComponents = this.state.groupsInfo[this.state.currGroup]
                           .map(member => 
            <GroupMember 
                name={member.username} 
                pitches={member.pitches} 
            />);
        }

        const userStyle  = this.state.badUser ? { color: '#f00' } : { color: '#000' };
        const userErrorStyle = this.state.badUser ? { display : 'block' } : { display : 'none' };

        let groupName, groupDescription;
        if (!this.state.groupNames) {
            groupName = "Loading...";
            groupDescription = "";
        }
        else if (this.state.groupNames.length === 0) {
            groupName = "Not a part of any groups yet";
            groupDescription = "";
        }
        else {
            groupName = this.state.groupNames[this.state.currGroup].name;
            groupDescription = this.state.groupNames[this.state.currGroup].description;
        }

        let buttonStyle;
        if (!this.state.groupNames || this.state.groupNames.length === 0) {
            buttonStyle = {display: "none"};
        }
        else {
            buttonStyle = {display: "inline-block"};
        }
        
        return(
            <div>
                <div className = "GroupSideBar">
                    <h3 className = "BigName">My Groups</h3>
                    {groupNames}
                    <div className = "ButtonContainer">
                        <button className= "GroupButton" onClick={() => window.location.href="/groups/new"}>
                            Create a Group
                        </button>
                    </div>
                </div>
                <h2 className = "BigName">
                    {groupName}
                </h2>
                <p>
                {groupDescription}
                </p>
                <div className = "MemberContainer">
                    <div className="MemberBox">
                        {memberComponents}
                    </div>
                    <div className="MemberButtonContainer">
                        <form className="GroupsForm" onSubmit={this.addMember} style={buttonStyle}>
                            <input
                                type="text"
                                name="newMember"
                                onChange={this.handleChange}
                                value={this.state.newMember}
                                placeholder="Enter username"
                                className="NewMemberInput"
                                style={userStyle}
                            />
                            <div className="ErrorMessage" style={userErrorStyle}>
                                {this.state.errorMessage}
                            </div>
                        </form>
                        <div className="MemberButtonColumn" style={buttonStyle}>
                            <button className= "GroupButton" onClick={this.addMember}>
                                Add Member
                            </button>
                        </div>
                        <div className="MemberButtonColumn" style={buttonStyle}>
                            <button className= "GroupButton" onClick={this.leaveGroup}>
                                Leave Group
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
}

export default Group;