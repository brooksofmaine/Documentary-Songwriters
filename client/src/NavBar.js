import React, {useState, useEffect} from 'react';
import './NavBar.css';
import UserFunc from "./api-helper/user";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBars, faTimes} from '@fortawesome/free-solid-svg-icons';
import {NavLink} from 'react-router-dom';
// import UserFunc from './api-helper/user.js';

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
                    <NavLink activeClassName="selected" to="/home" onClick={() => setOpenMenu(false)}>Home</NavLink>
                    <NavLink activeClassName="selected" to="/groups" onClick={() => setOpenMenu(false)}>Groups</NavLink>
                    <NavLink activeClassName="selected" to="/practice" onClick={() => setOpenMenu(false)}>Practice</NavLink>
                    <div className="dropdown-menu">
                        <NavLink activeClassName="selected" to="/profile" onClick={() => setOpenChild(!openChild)}>My Progress</NavLink>
                        <div className={openChild ? "child-links open" : "child-links"}>
                            <NavLink to="/profile/" onClick={() => setOpenMenu(false)}>My Progress</NavLink>
                            <NavLink to={"/profile/username/" + username} onClick={() => setOpenMenu(false)}>My Profile</NavLink>
                            <NavLink to="/profile/settings" onClick={() => setOpenMenu(false)}>Settings</NavLink>
                        </div>
                    </div>
                    <button className="menu-btn" onClick={log_out}>Log out</button>
                </div>
            </div>
        </nav>
    )
    

    
    // const regStyle = {
    //     "fontWeight" : 400
    // };
    // const boldStyle = {
    //     "fontWeight": 800
    // };
    
    // let homeStyle, groupsStyle, practiceStyle, progressStyle;
    // const url = window.location.href;

    // homeStyle = url.includes("home") ? boldStyle : regStyle;
    // groupsStyle = url.includes("groups") ? boldStyle : regStyle;
    // practiceStyle = url.includes("practice") ? boldStyle : regStyle;
    // progressStyle = url.includes("profile") ? boldStyle : regStyle;
    
    // const handleClick = () => {
    //     setOpenMenu(!openMenu)
    //     console.log("open menu set")
    // }

    // return (
    //     <nav className="NavBar">
    //         {/* <span className="menu-icon" onClick={handleClick}> */}
    //         <FontAwesomeIcon className="hamburger-icon" icon={faBars} onClick={() => setOpenMenu(true)} />
    //         {/* </span> */}
    //         <div className="links" id={openMenu ? "open-menu" : ""}>
    //             <button className="close-btn" onClick={() => {setOpenMenu(false)}}>X</button>
    //             <a style={homeStyle}
    //                 className="nav-link" 
    //                 href="/home">Home</a>
    //             <a style={groupsStyle} 
    //                 className="nav-link" 
    //                 href="/groups">Groups</a>
    //             <a style={practiceStyle}
    //                 className="nav-link"
    //                 href="/practice">Practice</a>
    //             <div className="dropdown-menu">
    //                 <a style={progressStyle} className="nav-link" href="/profile">My Progress</a>
    //                 <span className="dropdown">
    //                     <button className="DropdownButton" onClick={log_out}>Log out</button>
    //                 </span>
    //             </div>
    //         </div>
    //     </nav>
    // );
    
}

export default NavBar;
