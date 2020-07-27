import React from "react";

import './NewGroup.css';
import '../Forms.css';
import NewMember from './NewMember';
import NewGroupBox from './NewGroupBox';

import {server_add} from "../api-helper/config";
import UserFunc from "../api-helper/user";
import GroupFunc from '../api-helper/group';

/*
 * NewGroup
 * Top-level component
 * Displays entire form to create new group and add new users
 * Rendered at /groups/new
 */
class NewGroup extends React.Component {
    constructor() {
        super();
        this.state = {
            groupName    : "", // name of group to be created
            description  : "", // description of group to be created e.g. "For guitar players"
            currMember   : "", // name of member being added right now
            publicity    : "", // *** currently not in use *** for private/public groups

            members      : [], // array of members added so far
            lastKey      : -1, // tracks key of member to be added
            
            badUser      : false, // bool if error with user being added
            badGroup     : false, // bool if error with group name being created
            userErrorMessage : "", // to alert user what's wrong with the user
            groupErrorMessage: ""  // to alert user what's wrong with the group
        };

        this.handleChange  = this.handleChange.bind(this);
        this.handleClick   = this.handleClick.bind(this);
        this.addMember     = this.addMember.bind(this);
        this.clickToDelete = this.clickToDelete.bind(this);
        this.createGroup   = this.createGroup.bind(this)
    }

    /*
     * createGroup
     * Called when user clicks Create when they're done entering info
     * Verifies valid inputs and submits to API to create group
     */
    async createGroup(event) {
        event.preventDefault(); // prevents page refresh

        // makes sure group name field was filled in
        if (this.state.groupName === "") {
            this.setState({
                badGroup : true,
                groupErrorMessage: "You must enter a group name"
            });
            return;
        }

        let adminUsername;

        // *** admin username currently does nothing, but should in the future ***
        UserFunc.getCurrentUsername().then(username => {
            adminUsername = username;
        });

        // loads and posts group info that was entered
        const groupInfo = {
            groupName: this.state.groupName,
            description: this.state.description,
            visible: this.state.publicity === 'public' ? true : false,
            adminUsername: adminUsername
        }
        const query_url = server_add + '/api/group/create'
        const post_params = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(groupInfo)
        }
        const response = await fetch(query_url, post_params);
        const body = await response.json();
        console.log("Response body: ", body)

        // ensures there was no issue creating the group
        if ( body.err ) {
            this.setState({
                badGroup : true,
                groupErrorMessage: "A group with this name already exists"
            });
        }
        // redirect to groups page if successfully created group
        else {
            // automatically adds self
            const username = await UserFunc.getCurrentUsername();
            GroupFunc.addMember(this.state.groupName, username);

            for (let i = 0; i < this.state.members.length; i++) {
                GroupFunc.addMember(this.state.groupName, this.state.members[i].name);
            }
            window.location="/api/groups"
            // this.props.history.push("/api/groups");
        }

        return body;
    }

    /*
     * handleChange
     * Called whenever any of the input fields are altered
     * Maintains single point of truth
     * Undoes red error lettering if there was any now that it was altered
     */
    handleChange(event) {
        const {name, value} = event.target;
        this.setState({
            [name] : value
        });

        if ( name === 'currMember' ) {
            this.setState({
                badUser : false
            });
        }
        if ( name === 'groupName' ) {
            this.setState({
                badGroup : false
            });
        }
    }

    /*
     * handleClick
     * Ensures that page won't refresh when user tries to add a member
     */
    handleClick(event) {
        if ( event.key === 'Enter' ) {
            event.preventDefault();
            this.addMember();
        }
    }

    /*
     * addMember
     * Called when user clicks Add Member button
     * Ensures valid user then adds to user to current group in API
     */
    async addMember() {
        const username = await UserFunc.getCurrentUsername();

        fetch('/api/user/' + this.state.currMember)
            .then(response => response.json())
            .then(data => {
                console.log(data);

                // makes sure user isn't already in group
                let alreadyAdded = false;
                for ( let i = 0; i < this.state.members.length; i++ ) {
                    console.log(this.state.members[i])
                    if ( this.state.members[i].name === this.state.currMember ) {
                        alreadyAdded = true;
                        break;
                    }
                }

                // makes sure user exists
                if ( data.err ) {
                    this.setState({
                        badUser : true,
                        userErrorMessage : 'No user with this username exists'
                    });
                }
                else if ( alreadyAdded ) {
                    this.setState({
                        badUser : true,
                        userErrorMessage : 'This user has already been added'
                    }); 
                }
                // makes sure not adding self
                else if (this.state.currMember === username) {
                    this.setState({
                        badUser : true,
                        userErrorMessage : 'You are already in this group. There\'s no need to add yourself'
                    })
                }
                // if successful, adds new user to group
                else {
                    this.setState(prevState => {
                        prevState.members.push({
                            id : prevState.lastKey + 1,
                            name : this.state.currMember
                        });

                        return {
                            currMember : "",
                            members    : prevState.members,
                            lastKey    : prevState.lastKey + 1,
                            badUser    : false
                        }
                    });
                }
            });
    }

    /*
     * clickToDelete
     * Identifies user by their key and deletes them so won't be added
     * Called when user clicks on a to-be-added user
     */
    clickToDelete(key) {
        for ( let i = 0; i < this.state.members.length; i++ ) {
            if ( this.state.members[i].id === key ) {
                this.setState(prevState => {
                    prevState.members.splice(i, 1);

                    return { members : prevState.members }
                });
                break;
            }
        }
    }

    /*
     * Renders page with input fields to create group and add users to it
     */
    render() {
        // creates array of member components
        const newMembers = this.state.members.map(member => 
            <NewMember 
                deleteMe = {this.clickToDelete} 
                key      = {member.id} 
                id       = {member.id} 
                name = {member.name} 
            />);

        return(
            <div className="NewGroup">
                <h2 className="GroupHeading">Create a Group</h2>
                <NewGroupBox 
                    badUser={this.state.badUser}
                    badGroup={this.state.badGroup}

                    groupErrorMessage={this.state.groupErrorMessage}
                    userErrorMessage={this.state.userErrorMessage}

                    groupName={this.state.groupName}
                    description={this.state.description}
                    currMember={this.state.currMember}

                    newMembers={newMembers}

                    handleChange={this.handleChange}
                    handleClick={this.handleClick}

                    addMember={this.addMember}
                    createGroup={this.createGroup}
                />
            </div>
        )
    }
}

export default NewGroup;