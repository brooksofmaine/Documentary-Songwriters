import React, {useState, useEffect} from 'react';
import {Link, useRouteMatch, useParams} from 'react-router-dom'
import './ProfileSidebar.css';
import UserFunc from '../api-helper/user.js';

function ProfileSidebar() {
    // TODO: Centralize

    // const normalContainer = {backgroundColor: "#EEE", fontWeight: 200};
    // const hoverContainer = {backgroundColor: "#8EACCD", fontWeight: 700};
    // const selectedContainer = {backgroundColor: "#0A1658", fontWeight: 700};
    // const normalText = "NormalText";
    // const hoverText = "HoverText";
    // const selectedText = "SelectedText";
    
    const [page, setPage] = useState(0);
    const [username, setUsername] = useState("");

    // const [hoveringProgress, setHoveringProgress] = useState(false);
    // const [hoveringProfile, setHoveringProfile] = useState(false);
    // const [hoveringSettings, setHoveringSettings] = useState(false);

    // const [progressText, setProgressText] = useState(selectedText);
    // const [progressContainer, setProgressContainer] = useState(selectedContainer);
    // const [profileText, setProfileText] = useState(normalText);
    // const [profileContainer, setProfileContainer] = useState(normalContainer);
    // const [settingsText, setSettingsText] = useState(normalText);
    // const [settingsContainer, setSettingsContainer] = useState(normalContainer);


    const [selectedPage, setSelectedPage] = useState(0);
    const [userPath, setUserPath] = useState("")
    
    const id = useParams()
    console.log("ID:", id)
    // setUserPath(id)

    useEffect(() => {
        // let {id } = useParams()
        // if (id != "") {
        //     setUserPath(id)
        // }

        
        async function getUsernameAndPage() {
            const username = await UserFunc.getCurrentUsername();
            console.log(username);
            setUsername(username)
        }
        getUsernameAndPage();
        updatePages();

    }, [])

    // Current bug: calls when username is empty and so it automatically shades to this
    const getWindowLocation = () => {
        const url = window.location.href

        if (url.includes("settings")) {
            return 2
        } else if (url.includes(username)) {
            return 1
        } else {
            return 0
        }
    }

    const updatePages = (pageNum = getWindowLocation()) => {
        console.log("Called with pageNum", pageNum)
        setSelectedPage(pageNum)
        
    }

    // useEffect(() => {
    //     if (page === 0) {
    //         setProgressContainer(selectedContainer);
    //         setProgressText(selectedText);
    //     }
    //     else if (hoveringProgress) {
    //         setProgressContainer(hoverContainer);
    //         setProgressText(hoverText);
    //     }
    //     else {
    //         setProgressContainer(normalContainer);
    //         setProgressText(normalText);
    //     }
    // }, [hoveringProgress])

    // useEffect(() => {
    //     if (page === 1) {
    //         setProfileContainer(selectedContainer);
    //         setProfileText(selectedText);
    //     }
    //     else if (hoveringProfile) {
    //         setProfileContainer(hoverContainer);
    //         setProfileText(hoverText);
    //     }
    //     else {
    //         setProfileContainer(normalContainer);
    //         setProfileText(normalText);
    //     }
    // }, [hoveringProfile])

    // useEffect(() => {
    //     if (page === 2) {
    //         setSettingsContainer(selectedContainer);
    //         setSettingsText(selectedText);
    //     }
    //     else if (hoveringSettings) {
    //         setSettingsContainer(hoverContainer);
    //         setSettingsText(hoverText);
    //     }
    //     else {
    //         setSettingsContainer(normalContainer);
    //         setSettingsText(normalText);
    //     }
    // }, [hoveringSettings])

    return(
        <div className="ProfileSidebar">
            <Link className={selectedPage === 0 ? "sidebar-link selected-link" : "sidebar-link"}
                  to="/api/profile"
                  onClick={() => {updatePages(0)}}>Progress</Link>
            <Link className={selectedPage === 1 ? "sidebar-link selected-link" : "sidebar-link"} 
                  to={"/api/profile/" + username}
                  onClick={() => {updatePages(1)}}>Profile</Link>
            <Link className={selectedPage === 2 ? "sidebar-link selected-link" : "sidebar-link"}
                  to="/api/profile/settings"
                  onClick={() => {updatePages(2)}}>Settings</Link>

            {/* <a className={progressText} href="/api/profile">
                <p onMouseEnter={() => setHoveringProgress(true)} 
                   onMouseLeave={() => setHoveringProgress(false)} 
                   className="SidebarLink"
                   style={progressContainer}>
                    Progress
                </p>
            </a>
            <a className={profileText} href={"/api/profile/" + username}>
                <p onMouseEnter={() => setHoveringProfile(true)} 
                   onMouseLeave={() => setHoveringProfile(false)} 
                   className="SidebarLink"
                   style={profileContainer}>
                    Profile
                </p>
            </a>
            <a className={settingsText} href="/api/profile/settings">
                <p onMouseEnter={() => setHoveringSettings(true)} 
                   onMouseLeave={() => setHoveringSettings(false)} 
                   className="SidebarLink"
                   style={settingsContainer}>
                    Settings
                </p>
            </a> */}
        </div>
    )
}

export default ProfileSidebar;