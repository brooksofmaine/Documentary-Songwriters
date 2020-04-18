import React from 'react';
import './NavBar.css';
import UserFunc from "./api-helper/user";

class NavBar extends React.Component {
    constructor() {
        super();
        this.state = {
            highlighted: 0
        };
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
        const style = {
            "fontWeight": 800
        };
        return (
            <nav className="NavBar">
                <a style={style}
                   className="nav-link" 
                   href="/api/home">Home</a>
                <a className="nav-link" href="/api/groups">Groups</a>
                <div className="dropdown-menu">
                    <a className="nav-link" href="/api/profile">My Progress</a>
                    <span className="dropdown">
                       <button onClick={this.log_out}>Log out</button>
                    </span>
                </div>
            </nav>
        );
    }
}

export default NavBar;
