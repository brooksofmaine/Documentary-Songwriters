import React, { useState, useEffect } from 'react';
import './MobileProfileSidebar.css';
import {Link, useRouteMatch, useParams} from 'react-router-dom'
import UserFunc from '../api-helper/user.js';

function MobileProfileSidebar() {

    const [open, setOpen] = useState(false);
    const [selectedPage, setSelectedPage] = useState(0);
    const [usrname, setUsername] = useState("");

    useEffect(() => {
        
        async function getUsernameAndPage() {
            const username = await UserFunc.getCurrentUsername();
            setUsername(username)
        }
        getUsernameAndPage();
        updatePages();

    }, [])

    useEffect(() => {
        updatePages()
    }, [usrname])

    const GetWindowLocation = () => {
        const url = window.location.href
        
        if (url.includes("settings")) {
            return 2
        } else if (url.includes(usrname)) {
            return 1
        } else {
            return 0
        }
    }

    const updatePages = (pageNum = GetWindowLocation()) => {
        console.log("Called with pageNum", pageNum)
        setSelectedPage(pageNum)
    }

    const menuStyle = open ? { transform: 'translateX(0)' } : { transform: 'translateX(-100%)' };
    const line1style = open ? { transform: 'rotate(45deg)', backgroundColor: '#fff' } : 
                                { transform: 'rotate(0)' };
    const line2style = open ? { opacity: 0, transform:  'translateX(20px)', backgroundColor: '#fff' } : 
                                { opacity: 1, tranform: 'translateX(0)' };
    const line3style = open ? { transform: 'rotate(-45deg)', backgroundColor: '#fff' } : 
                                { tranform: 'rotate(0)' };
    const overlayStyle = open ? { opacity: 0.25 } :
                                { opacity: 0 }; 

    function toggleMenu() {
        setOpen(!open);
    }

    function closeMenu() {
        setOpen(false);
    }

        

    return(
        <div>
            {/* <div className="StyledBurger" onClick={toggleMenu}>
                <div className="BurgerLine" style={line1style}></div>
                <div className="BurgerLine" style={line2style}></div>
                <div className="BurgerLine" style={line3style}></div>
            </div> */}
            <div className="BurgerMenu" style={menuStyle}>
                <Link className={selectedPage === 0 ? "SelectedBurgerLink" : ""}
                    to="/api/profile"
                    onClick={() => {updatePages(0)}}>Progress</Link>
                <Link className={selectedPage === 1 ? "SelectedBurgerLink" : ""} 
                    to={"/api/profile/" + usrname}
                    onClick={() => {updatePages(1)}}>Profile</Link>
                <Link className={selectedPage === 2 ? "SelectedBurgerLink" : ""}
                    to="/api/profile/settings"
                    onClick={() => {updatePages(2)}}>Settings</Link>
            </div>
            {/* <div className="PopupOverlay" onClick={closeMenu} style={overlayStyle}></div> */}
        </div>
    )
}

export default MobileProfileSidebar;
