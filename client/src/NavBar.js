import React from 'react';
import './NavBar.css';
import NavLink from './NavLink.js';

class NavBar extends React.Component {
    render() {
        return (
            <nav className="NavBar">
                <NavLink url="#" status="selected" value="Home"/>
                <NavLink url="#" value="Progress"/>
                <NavLink url="#" value="Groups"/>
                <NavLink url="#" value="My Profile"/>
            </nav>
        );
    }
}

export default NavBar;
