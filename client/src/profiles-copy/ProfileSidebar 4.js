import React, {useState, useEffect} from 'react';
import './ProfileSidebar.css';
import UserFunc from '../api-helper/user.js';

function ProfileSidebar() {
    const normalContainer = {backgroundColor: "#EEE", fontWeight: 200};
    const hoverContainer = {backgroundColor: "#8EACCD", fontWeight: 700};
    const selectedContainer = {backgroundColor: "#0A1658", fontWeight: 700};
    const normalText = "NormalText";
    const hoverText = "HoverText";
    const selectedText = "SelectedText";
    
    const [page, setPage] = useState(0);
    const [username, setUsername] = useState("");

    const [hoveringProgress, setHoveringProgress] = useState(false);
    const [hoveringProfile, setHoveringProfile] = useState(false);
    const [hoveringSettings, setHoveringSettings] = useState(false);

    const [progressText, setProgressText] = useState(selectedText);
    const [progressContainer, setProgressContainer] = useState(selectedContainer);
    const [profileText, setProfileText] = useState(normalText);
    const [profileContainer, setProfileContainer] = useState(normalContainer);
    const [settingsText, setSettingsText] = useState(normalText);
    const [settingsContainer, setSettingsContainer] = useState(normalContainer);

    
    useEffect(() => {
        
        getUsernameAndPage();
        
        async function getUsernameAndPage() {
            const username = await UserFunc.getCurrentUsername();
            console.log(username);
            setUsername(username);

            const url = window.location.href;
            console.log(url);
            if (url.includes(username)) {
                setPage(1);
            }
            else if (url.includes("settings")) {
                setPage(2);
            }
            else {
                setPage(0);
            }
            console.log(page)
        }
    }, [])

    useEffect(() => {
        if (page === 0) {
            setProgressContainer(selectedContainer);
            setProgressText(selectedText);
        }
        else if (hoveringProgress) {
            setProgressContainer(hoverContainer);
            setProgressText(hoverText);
        }
        else {
            setProgressContainer(normalContainer);
            setProgressText(normalText);
        }
    }, [hoveringProgress])

    useEffect(() => {
        if (page === 1) {
            setProfileContainer(selectedContainer);
            setProfileText(selectedText);
        }
        else if (hoveringProfile) {
            setProfileContainer(hoverContainer);
            setProfileText(hoverText);
        }
        else {
            setProfileContainer(normalContainer);
            setProfileText(normalText);
        }
    }, [hoveringProfile])

    useEffect(() => {
        if (page === 2) {
            setSettingsContainer(selectedContainer);
            setSettingsText(selectedText);
        }
        else if (hoveringSettings) {
            setSettingsContainer(hoverContainer);
            setSettingsText(hoverText);
        }
        else {
            setSettingsContainer(normalContainer);
            setSettingsText(normalText);
        }
    }, [hoveringSettings])

    return(
        <div className="ProfileSidebar">
            <padding className="Padding"></padding>
            <a className={progressText} href="/api/profile">
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
            <a className={settingsText} href="/api/settings">
                <p onMouseEnter={() => setHoveringSettings(true)} 
                   onMouseLeave={() => setHoveringSettings(false)} 
                   className="SidebarLink"
                   style={settingsContainer}>
                    Settings
                </p>
            </a>
        </div>
    )
}

export default ProfileSidebar;