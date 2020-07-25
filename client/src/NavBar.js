import React, {useState, useEffect} from 'react';
import './NavBar.css';
import UserFunc from "./api-helper/user";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBars, faTimes} from '@fortawesome/free-solid-svg-icons';
import {NavLink} from 'react-router-dom';

function NavBar() {

    const [openMenu, setOpenMenu] = useState(false)
    const [openChild, setOpenChild] = useState(false)
    const [username, setUsername] = useState("")
    const openStyle = {transform: "translateX(0%)"}

    const log_out = async () => {
        const result = await UserFunc.logUserOut();
        if (result === "Success") {
                window.location = "/";
        } else {
            console.log("error: log out not success");
            window.location = "/";
        }
        localStorage.setItem("isLoggedIn", false)
    }

    useEffect(() => {
        async function getUsername() {
            const username = await UserFunc.getCurrentUsername();
            setUsername(username)
        }
        getUsername();

    }, [])


    
    
    return (
        <nav className="NavBar">
            <FontAwesomeIcon className="hamburger icon" icon={faBars} onClick={() => setOpenMenu(true)} />
            <div className="items" style={openMenu ? openStyle : {}}>
                <FontAwesomeIcon className="close icon" icon={faTimes} onClick={() => setOpenMenu(false)} />
                <div className="pages">
                    <NavLink tabindex="-1   " activeClassName="selected" to="/api/home" onClick={() => setOpenMenu(false)}>Home</NavLink>
                    <NavLink activeClassName="selected" to="/api/groups" onClick={() => setOpenMenu(false)}>Groups</NavLink>
                    <NavLink activeClassName="selected" to="/api/practice" onClick={() => setOpenMenu(false)}>Practice</NavLink>
                    <NavLink activeClassName="selected" to="/api/creators" onClick={() => setOpenMenu(false)}>Creators</NavLink>
                    <div className="dropdown-menu">
                        <NavLink activeClassName="selected" to="/api/profile" onClick={() => setOpenChild(!openChild)}>My Progress</NavLink>
                        <div className={openChild ? "child-links open" : "child-links"}>
                            <NavLink to="/api/profile/" onClick={() => setOpenMenu(false)}>My Progress</NavLink>
                            <NavLink to={"/api/profile/user/" + username} onClick={() => setOpenMenu(false)}>My Profile</NavLink>
                            <NavLink to="/api/profile/settings" onClick={() => setOpenMenu(false)}>Settings</NavLink>
                        </div>
                    </div>
                    <button className="menu-btn" onClick={log_out}>Log out</button>
                </div>
            </div>
        </nav>
    )
}

export default NavBar;
