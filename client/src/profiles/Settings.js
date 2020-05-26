import React, {useState, useEffect} from "react"
import UserFunc from "../api-helper/user";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faEdit} from '@fortawesome/free-solid-svg-icons'
import './Settings.css'

// TODO: Form validation for inputs
function Settings(props) {
    const [userInfo, setUserInfo] = useState(null)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("") // Update: Super insecure
    const [instruments, setInstruments] = useState([])
    const [goal, setGoal] = useState(0)
    const [formDisabled, setFormDisabled] = useState(true)

    // TODO: Get all this info from UserData only 
    const fetchUserData = async () => {
        const userData = await UserFunc.getCurrentUser()
        if (userData) {
            console.log("User Data:", userData)
            if (userData.status === "logged_in") {
                setUsername(userData.user.username)
                setFirstName(userData.user.firstName)
                setLastName(userData.user.lastName)
                setEmail(userData.user.email)
                
                setUserInfo(userData)
                if (userData.user.weeklyAchievement) {
                    setGoal(userData.user.weeklyAchievement)
                }
            } 
        } 
    }

    useEffect(() => {
        fetchUserData()
        
    }, [])

    const handleButton = () => {
        if (!formDisabled) {
            handleSubmit()
        }
        setFormDisabled(!formDisabled)

    }
    // TODO: Add check for if changed to invalid email/username
    const handleSubmit = () => {
        if (userInfo) {
            if (userInfo.user.firstName != firstName) {
                UserFunc.changeInfo("firstName", firstName)
            }
            if (userInfo.user.lastName != lastName) {
                UserFunc.changeInfo("lastName", lastName)
            }
            if (userInfo.user.email != email) {
                UserFunc.changeInfo("email", email)
            }
            if (userInfo.user.weeklyAchievement) {
                if (userInfo.user.weeklyAchievement != goal) {
                    UserFunc.changeInfo("weeklyAchievement", goal)
                }
            } else {
                UserFunc.changeInfo("weeklyAchievement", goal)
            }

        }
        
    }



    return(
        <div className="Settings">
            <button className="settings-btn" onClick={handleButton}>
                {formDisabled ? 
                    <FontAwesomeIcon icon={faEdit} size="2x"/> :
                    "Save"}
            </button>
            <div className="settings-form">
                <label>
                    Name
                    <div className="name row">
                        <input disabled={formDisabled} placeholder="First Name" type="text" value={firstName} onChange={(e) => {setFirstName(e.target.value)}} />
                        <input disabled={formDisabled} type="text" value={lastName} onChange={(e) => {setLastName(e.target.value)}} />
                    </div>
                    
                </label>
                <label>
                    Username
                    <input disabled={true} type="text" value={username} onChange={(e) => {setUsername(e.target.value)}} />
                </label>
                <label>
                    Email
                    <input disabled={formDisabled} type="text" value={email} onChange={(e) => {setEmail(e.target.value)}} />
                </label>
                <label>
                    Password
                    <input disabled={formDisabled} type="password" value={password} onChange={(e) => {setPassword(e.target.value)}} />
                </label>
                <label>
                    Goals
                    <div className="pitch row">
                        <p># of pitches: </p>
                        <input disabled={formDisabled} type="number" value={goal} onChange={(e) => {setGoal(e.target.value)}} />
                    </div>
                    
                </label>
            </div>
            
        </div>
    )
}

export default Settings