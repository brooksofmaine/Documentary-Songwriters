import React from 'react';
import './NavBar.css';
import NavLink from './NavLink.js';

class NavBar extends React.Component {
    render() {
        return (
            <nav className="NavBar">
                <NavLink url="/api/home" status="selected" value="Home"/>
                <NavLink url="#" value="Progress"/>
                <NavLink url="/api/groups" value="Groups"/>
                <div className="added-item">
                    <NavLink url="#" value="My Profile"/>
                    <span className="dropdown">
                        <NavLink className="dropdown" url="/" value="Logout" />
                    </span>
                </div>
                
            </nav>
        );
    }
}

export default NavBar;
