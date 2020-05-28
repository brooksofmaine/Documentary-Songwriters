import React from "react";

import './NewGroup.css';
import NewMember from './NewMember';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import {getGroup} from '../api-helper/group.js'

import {server_add} from "../api-helper/config";
import UserFunc from "../api-helper/user";
import GroupFunc from '../api-helper/group';


class NewGroup extends React.Component {
    constructor() {
        super();
        this.state = {
            groupName    : "",
            description  : "",
            currMember   : "",
            publicity    : "",
            members      : [],
            lastKey      : -1,
            badUser      : false,
            badGroup     : false,
            errorMessage : ""
        };

        this.handleChange  = this.handleChange.bind(this);
        this.handleClick   = this.handleClick.bind(this);
        this.addMember     = this.addMember.bind(this);
        this.clickToDelete = this.clickToDelete.bind(this);
        this.createGroup   = this.createGroup.bind(this)
    }

    async createGroup(event) {
        event.preventDefault();

        let adminUsername;

        // admin username currently does nothing, but should in the future
        UserFunc.getCurrentUsername().then(username => {
            adminUsername = username;
        });

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

        if ( body.err ) {
            this.setState({
                badGroup : true
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
            this.props.history.push("/api/groups");
        }

        return body;
    }

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

    handleClick(event) {
        if ( event.key === 'Enter' ) {
            event.preventDefault();
            this.addMember();
        }
    }

    async addMember() {
        const username = await UserFunc.getCurrentUsername();

        fetch('/api/user/' + this.state.currMember)
            .then(response => response.json())
            .then(data => {
                console.log(data);

                let alreadyAdded = false;

                for ( let i = 0; i < this.state.members.length; i++ ) {
                    console.log(this.state.members[i])
                    if ( this.state.members[i].name === this.state.currMember ) {
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
                else if (this.state.currMember === username) {
                    this.setState({
                        badUser : true,
                        errorMessage : 'You are already in this group. There\'s no need to add yourself'
                    })
                }
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

    render() {
        console.log(this.state.members)
        const userStyle  = this.state.badUser ? { color: '#f00' } : { color: '#000' };

        const userErrorStyle = this.state.badUser ? { display : 'block' } : { display : 'none' };
        const groupErrorStyle = this.state.badGroup ? { display : 'block' } : { display : 'none' };

        const newMembers = this.state.members.map(member => 
            <NewMember 
                deleteMe = {this.clickToDelete} 
                key      = {member.id} 
                id       = {member.id} 
                name = {member.name} 
            />);

        const privateStyle = this.state.publicity === 'private' ? { fontWeight : 400 } : { fontWeight : 200 };
        const publicStyle  = this.state.publicity === 'public'  ? { fontWeight : 400 } : { fontWeight : 200 };

        return(
            <div className="NewGroup">
                <h2 className = "GroupHeading">Create a Group</h2>
                <div className = "GroupBox">
                    <form>
                        <div className="InputWrapper">  
                            <input 
                                type="text" 
                                name="groupName"
                                onChange={this.handleChange}
                                value={this.state.groupName}
                                placeholder="Group Name"
                                className="GroupFormText"
                            />
                        </div>
                        <br />
                        <div className="ErrorMessage" style={groupErrorStyle}>
                            A group with this name already exists
                        </div>

                        <div className="InputWrapper">  
                            <input 
                                type="text" 
                                name="description"
                                onChange={this.handleChange}
                                value={this.state.description}
                                placeholder="Group Description"
                                className="GroupFormText"
                            />
                        </div>
                        <br />

                        <div className="InputWrapper">
                            <input 
                                type="text" 
                                name="currMember"
                                onChange={this.handleChange}
                                value={this.state.currMember}
                                onKeyPress={this.handleClick}
                                placeholder="Enter username of member to invite then click search"
                                className="GroupFormText"
                                style={userStyle}
                            />
                            <span><FontAwesomeIcon icon={faSearch} className="SearchIcon" onClick={this.addMember}/></span>
                        </div>
                        <br />
                        <div className="ErrorMessage" style={userErrorStyle}>
                            {this.state.errorMessage}
                        </div>

                        <div className="NewGroupMemberBox">
                            {newMembers}
                        </div>
                        <div className="ButtonBox">
                            <button 
                                className="GroupButton" 
                                onClick={this.createGroup}>Create Group</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
    /* public/private not currentl implemented
     * add this back in if they ever are 
     */

     /*
                         <div className="RadioBox">
                            <label className="RadioLabel" style={privateStyle}>
                                <input 
                                    type="radio" 
                                    name="publicity"
                                    value="private"
                                    onChange={this.handleChange}
                                    className="RadioButton"
                                />
                                <div className="NoCheckButton"></div>
                                <FontAwesomeIcon icon={faCheckCircle} className="CheckButton"/>
                                Private
                            </label>

                            <label className="RadioLabel" style={publicStyle}>
                                <input 
                                    type="radio" 
                                    name="publicity"
                                    value="public"
                                    onChange={this.handleChange}
                                    className="RadioButton"
                                />
                                <div className="NoCheckButton"></div>
                                <FontAwesomeIcon icon={faCheckCircle} className="CheckButton"/>
                                Public
                            </label>
                        </div>
                        <br />
    */
}

export default NewGroup;