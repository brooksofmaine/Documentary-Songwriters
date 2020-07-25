import React from 'react'
import ProfileSidebar from './ProfileSidebar'
import UserProfile from './UserProfile'
import NavBar from '../NavBar'

function ProfileWrapper({visibility, ...rest}) {
    if (visibility === "external") {
        return (
            <div>
                <NavBar />
                <div className="profile-components">
                    <ProfileSidebar />
                    <UserProfile {...rest}/>
                </div>
            </div>
            
        )
    } else {
        return (
        <div>
            <NavBar />
            <div className="profile-components">
                <UserProfile {...rest}/>
            </div>
        </div>
            
        )
    }
}

export default ProfileWrapper
