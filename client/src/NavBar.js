import React from 'react';
import './NavBar.css';

class NavBar extends React.Component {
    constructor() {
        super()
        this.state = {
            highlighted: 0
        }
    }


    render() {
        const style = {
            "fontWeight": 800
        }
        return (
            <nav className="NavBar">
                <a style={style}
                   className="nav-link" 
                   href="/api/home">Home</a>
                <a className="nav-link" href="/api/groups">Groups</a>
                <div className="dropdown-menu">
                    <a className="nav-link" href="/api/profile">My Progress</a>
                    <span className="dropdown">
                       <a href="/">Log out</a>
                    </span>
                </div>
            </nav>
        );
    }
}

export default NavBar;
