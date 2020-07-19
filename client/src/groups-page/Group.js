import React from 'react';

import GroupMember from './GroupMember';
import GroupName from './GroupName';
import GroupSidebar from './GroupSidebar';
import BigGroupName from './BigGroupName';
import GroupDescription from './GroupDescription';
import GroupMemberContainer from './GroupMemberContainer';

import './Group.css';

import GroupFunc from '../api-helper/group.js'
import UserFunc from '../api-helper/user.js';
import RecordingFunc from '../api-helper/recording.js';
import {server_add} from "../api-helper/config";

/*
 * Group
 * Top-level component
 * Renders at /groups
 * Displays all groups user is in, as well as the members and details of each group
 */
class Group extends React.Component {
    constructor() {
        super();
        this.state = {
            username: "", // username of current user
            
            currGroup : 0,    // index of current displaying group in all groups
            groupsInfo: null, // array arrays that represent info for one group
            groupNames: null, // names of all groups user is in

            newMember: "",   // name of member to be added, form field
            badUser: false,  // bool if error message for user should be displayed
            errorMessage: "" // error message to display if something wrong with adding member
        }
        this.showGroup = this.showGroup.bind(this);
        this.getGroups = this.getGroups.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addMember = this.addMember.bind(this);
        this.leaveGroup = this.leaveGroup.bind(this);
    }

    /*
     * On mounting, calls function to retrieve group data from API
     */    
    componentDidMount() {
        this.getGroups();
    }
    
    /* 
     * showGroup
     * Changes which group is currently displayed
     * Called when user clicks on name of group in sidebar
     * Key: index of group to display
     */
    showGroup(key) {
        this.setState({currGroup : key});
    }

    /*
     * getGroups
     * Calls API to retrieve and store group data
     */
    async getGroups() {
        
        let username, groups, data;
        username = await UserFunc.getCurrentUsername()
        this.setState({
            username: username // gather username
        });

        data  = await UserFunc.getGroups(username) // gather groups
        groups = data.Groups;

        let tempGroupsInfo = [];
        let groupsInfo     = [];
        let groupNames     = [];
        let oneGroupInfo   = [];
        let memberUsername, memberPitches;

        // for all groups that user is apart of
        for (let i = 0; i < groups.length; i++) {
        
            // get members of one group at a time
            tempGroupsInfo[i] = await GroupFunc.getMembers(groups[i].groupName);
            oneGroupInfo.splice(0);

            // for each member of the current group
            for (let j = 0; j < tempGroupsInfo[i].length; j++) {
                memberUsername = tempGroupsInfo[i][j].username;
                memberPitches = await RecordingFunc.getPitchTotalCount(memberUsername,
                    RecordingFunc.nthDayAgo(7),
                    new Date());
                
                // group holds array of users
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

    /*
     * handleChange
     * Updates form input for single point of truth
     * Called when user types in member field
     */
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

    /*
     * addMember
     * Adds the specified member to the current group
     * Triggers when user clicks Add Member button
     */
    addMember(event) {
        event.preventDefault(); // prevents page refresh

        // makes sure field isn't empty
        if ( this.state.newMember === "") {
            this.setState({
                badUser : true,
                errorMessage : 'Please enter the name of a user to add'
            });
        }

        fetch('/api/user/' + this.state.newMember)
            .then(response => response.json())
            .then(data => {
                // makes sure user not already in this group
                let alreadyAdded = false;
                const members = this.state.groupsInfo[this.state.currGroup];
                console.log(members)

                for ( let i = 0; i < members.length; i++ ) {
                    
                    if ( members[i].username === this.state.newMember ) {
                        alreadyAdded = true;
                        break;
                    }
                }

                // accounts for various errors and reports to user
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
                // add user to group upon success
                else {
                    GroupFunc.addMember(this.state.groupNames[this.state.currGroup].name,
                                        this.state.newMember);
                    this.getGroups();
                    this.setState({
                        newMember: ""
                    })
                }

            });
    }

    /*
     * leaveGroup
     * Removes current user from currently displayed group
     * Called when user clicks Leave Group button
     */
    async leaveGroup() {
        // retrieves current group
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
        // triggers page to get info from API again
        this.getGroups();
    }

    /*
     * Renders entire Groups page, passing in necessary logic as props
     */
    render() {

        // creates array of GroupName components
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
        
        // creates array of GroupMember components
        let memberComponents;
        if (this.state.groupsInfo !== null && this.state.groupsInfo.length > this.state.currGroup) {
            memberComponents = this.state.groupsInfo[this.state.currGroup]
                           .map(member => 
            <GroupMember 
                name={member.username} 
                pitches={member.pitches} 
            />);
        }

        // sets loading style and name as appropriate based on groups user's a part of
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

        // only displays add member and leave group buttons if user is in any groups
        let buttonStyle;
        if (!this.state.groupNames || this.state.groupNames.length === 0) {
            buttonStyle = {display: "none"};
        }
        else {
            buttonStyle = {display: "inline-block"};
        }
        
        return(
            <div className="Group">
                <GroupSidebar groupNames={groupNames} />
                <BigGroupName groupName={groupName} />
                <GroupDescription groupDescription={groupDescription} />
                <GroupMemberContainer 
                    badUser={this.state.badUser}
                    buttonStyle={buttonStyle}
                    members={memberComponents}
                    newMember={this.state.newMember}
                    errorMessage={this.state.errorMessage}
                    addMember={this.addMember}
                    handleChange={this.handleChange}
                    leaveGroup={this.leaveGroup}
                />
            </div>
        );
    };
}

export default Group;