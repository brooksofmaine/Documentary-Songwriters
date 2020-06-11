import React from 'react';
import './NavBar.css';
import UserFunc from "./api-helper/user";

class NavBar extends React.Component {
    constructor() {
        super();
    }

    async log_out() {
        const result = await UserFunc.logUserOut();
        if (result === "Success") {
                window.location = "/";
        } else {
            console.log("error: log out not success");
            window.location = "/";
        }
    }

    render() {
        const regStyle = {
            "fontWeight" : 400
        };
        const boldStyle = {
            "fontWeight": 800
        };
        
        let homeStyle, groupsStyle, practiceStyle, progressStyle;
        const url = window.location.href;

        homeStyle = url.includes("home") ? boldStyle : regStyle;
        groupsStyle = url.includes("groups") ? boldStyle : regStyle;
        practiceStyle = url.includes("practice") ? boldStyle : regStyle;
        progressStyle = url.includes("profile") ? boldStyle : regStyle;
        
        return (
            <nav className="NavBar">
                <a style={homeStyle}
                   className="nav-link" 
                   href="/home">Home</a>
                <a style={groupsStyle} 
                   className="nav-link" 
                   href="/groups">Groups</a>
                <a style={practiceStyle}
                   className="nav-link"
                   href="/practice">Practice</a>
                <div className="dropdown-menu">
                    <a style={progressStyle} className="nav-link" href="/profile">My Progress</a>
                    <span className="dropdown">
                       <button className="DropdownButton" onClick={this.log_out}>Log out</button>
                    </span>
                </div>
            </nav>
        );
    }
}

export default NavBar;
