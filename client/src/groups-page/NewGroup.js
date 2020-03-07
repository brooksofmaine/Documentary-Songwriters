import React from "react";

import './NewGroup.css';
import NewMember from './NewMember';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import {getGroup} from '../api-helper/group.js'

import {server_add} from "../api-helper/config";


class NewGroup extends React.Component {
    constructor() {
        super();
        this.state = {
            groupName : "",
            currMember : "",
            publicity : "",
            members : [],
            lastKey : -1
        };

        this.handleChange  = this.handleChange.bind(this);
        this.clickToDelete = this.clickToDelete.bind(this);
        this.createGroup = this.createGroup.bind(this)
    }

    


    async createGroup() {
        const groupInfo = {
            groupName: this.state.groupName,
            description: "TODO: Add description to front-end groups.",
            visible: this.state.publicity === 'public' ? true : false
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
        if (response.status !== 200) {
          throw Error(body.message) 
        }
        return body;
    }

    handleChange(event) {
        const {name, value} = event.target;
        this.setState({
            [name] : value
        });

        // update list of members if necessary and clears current field
        if ( name === 'currMember' && value.substr(value.length - 1) === ',' ) {
            this.setState(prevState => {
                const nameNoComma = value.substr(0, value.length - 1);
                prevState.members.push({
                    id : prevState.lastKey + 1,
                    name : nameNoComma
                });

                return {
                    currMember : "",
                    members : prevState.members,
                    lastKey : prevState.lastKey + 1
                }
            })
        } 
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
        const newMembers = this.state.members.map(member => <NewMember deleteMe = {this.clickToDelete} key = {member.id} id = {member.id} name = {member.name} />);

        const privateStyle = this.state.publicity === 'private' ? { fontWeight : 400 } : { fontWeight : 200 };
        const publicStyle  = this.state.publicity === 'public'  ? { fontWeight : 400 } : { fontWeight : 200 };

        return(
            <div>
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

                        <div className="InputWrapper">
                            <input 
                                type="text" 
                                name="currMember"
                                onChange={this.handleChange}
                                value={this.state.currMember}
                                placeholder="Search members to invite"
                                className="GroupFormText"
                            />
                            <span><FontAwesomeIcon icon={faSearch} className="SearchIcon"/></span>
                        </div>
                        <br />

                        <div className="NewGroupMemberBox">
                            {newMembers}
                        </div>

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

                        <div className="ButtonBox">
                            <button 
                                className="GroupButton" 
                                onClick={() =>  {
                                    this.createGroup();
                                    this.props.history.push("/api/groups");
                                }}>Create Group</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default NewGroup;