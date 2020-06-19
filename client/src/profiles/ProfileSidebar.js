import React, {useState, useEffect} from 'react';
import {Link, useRouteMatch, useParams} from 'react-router-dom'
import './ProfileSidebar.css';
import UserFunc from '../api-helper/user.js';

function ProfileSidebar() {
    // TODO: Centralize
    const [page, setPage] = useState(0);
    const [usrname, setUsername] = useState("");


    const [selectedPage, setSelectedPage] = useState(0);
    
    // const id = useParams()
    // console.log("ID:", id)

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

    let {username} = useParams()
    // console.log("path", username)


    // Current bug: calls when username is empty and so it automatically shades to this
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

    return(
        <div className="ProfileSidebar">
            <Link className={selectedPage === 0 ? "sidebar-link selected-link" : "sidebar-link"}
                  to="/profile"
                  onClick={() => {updatePages(0)}}>Progress</Link>
            <Link className={selectedPage === 1 ? "sidebar-link selected-link" : "sidebar-link"} 
                  to={"/profile/" + usrname}
                  onClick={() => {updatePages(1)}}>Profile</Link>
            <Link className={selectedPage === 2 ? "sidebar-link selected-link" : "sidebar-link"}
                  to="/profile/settings"
                  onClick={() => {updatePages(2)}}>Settings</Link>

        </div>
    )
}

export default ProfileSidebar;