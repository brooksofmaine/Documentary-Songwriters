import React, {useState, useEffect} from "react"
import UserFunc from "../api-helper/user";
import {validateEmail, validatePitches} from '../utils/validate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faEdit} from '@fortawesome/free-solid-svg-icons'
import './Settings.css'

// TODO: Cleanup by using a better child component
function Settings(props) {

    // Form input value states
    const [userInfo, setUserInfo] = useState(null)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("") // Update: Super insecure

    // Validity states
    const [firstNameValid, setFirstNameValid] = useState(true)
    const [lastNameValid, setLastNameValid] = useState(true)
    const [emailValid, setEmailValid] = useState(true)
    const [pitchesValid, setPitchesValid] = useState(true)


    // const [instruments, setInstruments] = useState([])
    const [goal, setGoal] = useState(10)
    const [formDisabled, setFormDisabled] = useState(true)

    // TODO: Get all this info from UserData only 
    const fetchUserData = async () => {

        const currentUser = await UserFunc.getCurrentUser()
        const userData = await UserFunc.getUserInfo(currentUser.user.username)
        console.log("userData:", userData)
        if (userData) {
           setUserInfo(userData)
           setFormFields(userData)
        } 
    } 
    

    useEffect(() => {
        fetchUserData()
        
    }, [])

    const setFormFields = (data) => {
        setUsername(data.username)
        setFirstName(data.firstName)
        setLastName(data.lastName)
        setEmail(data.email)
        if (data.weeklyAchievement) {
            setGoal(data.weeklyAchievement)
        }
    }

    const handleButton = (e) => {
        if (!formDisabled) {
            handleSubmit(e)
        } else {
            setFormDisabled(!formDisabled)
        }
        
    }

    // TODO: Add check for if changed to invalid email/username
    const handleSubmit = (e) => {
        console.log("Calling handleSubmit")
        var invalid = false;
        if (userInfo) {
            if (userInfo.firstName !== firstName) {
                if (firstName.length < 1 || firstName.length > 20) {
                    setFirstNameValid(false)
                    invalid = true;
                    e.preventDefault()
                } else {
                    UserFunc.changeInfo("firstName", firstName)
                    setFirstNameValid(true)
                }
                
            }
            if (userInfo.lastName !== lastName) {
                if (lastName.length < 1 || lastName.length > 20) {
                    setLastNameValid(false)
                    invalid = true;
                    e.preventDefault()
                } else {
                    UserFunc.changeInfo("lastName", lastName)
                    setLastNameValid(true)
                }
            }
            if (userInfo.email !== email) {
                if (validateEmail(email)) {
                    UserFunc.changeInfo("email", email)
                    setEmailValid(true)
                    console.log("setting email valid");
                } else {
                    invalid = true;
                    console.log("setting email invalid")
                    setEmailValid(false)
                    // e.preventDefault()
                }
            }
            if (userInfo.weeklyAchievement) {
                if (userInfo.weeklyAchievement !== goal) {
                    if (validatePitches(goal)) {
                        UserFunc.changeInfo("weeklyAchievement", goal)
                        setPitchesValid(true)
                    } else {
                        setGoal(userInfo.weeklyAchievement)
                        invalid = true;
                        setPitchesValid(false)
                    }
                    
                }
            } else {
                if (validatePitches(goal)) {
                    UserFunc.changeInfo("weeklyAchievement", goal)
                } else {
                    setGoal(userInfo.weeklyAchievement)
                    invalid = true;
                }
            }
        }
        if (!invalid) {
            setFormDisabled(!formDisabled)
        } 
    }

    // Delete:
    useEffect(() => {
        if (emailValid) {
            console.log("Email valid true")
        } else {
            console.log("Email valid false")
        }
    }, [emailValid])


    // TODO: Validate all inputs, also inputs for pitch counting
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
                        <input disabled={formDisabled} 
                               placeholder="First Name" 
                               type="text" 
                               value={firstName} 
                               onChange={(e) => {setFirstName(e.target.value)}} 
                               className={firstNameValid ? 'normal-input' : 'invalid-input'}
                               />
                        <input disabled={formDisabled} type="text" value={lastName} onChange={(e) => {setLastName(e.target.value)}} className={lastNameValid ? 'normal-input' : 'invalid-input'}/>
                    </div>
                    
                </label>
                <span className="name-error">
                        <p className={firstNameValid ? 'error hidden' : 'error'}>First name must be between 0 and 20 characters</p>
                        <p className={lastNameValid ? 'error hidden' : 'error'}>Last name must be between 0 and 20 characters</p>
                    </span>
                <label> 
                    Username
                    <input disabled={true} type="text" value={username} onChange={(e) => {setUsername(e.target.value)}} className="normal-input" />
                    
                </label>
                <label>
                    Email
                    <span>
                    <input disabled={formDisabled} type="text" value={email} onChange={(e) => {setEmail(e.target.value)}} className={emailValid ? 'normal-input' : 'invalid-input'}/>
                    <p className={emailValid ? 'error hidden' : 'error'}>Please enter a valid email address</p>
                    </span>
                </label>
                <label>
                    Password
                    <input disabled={formDisabled} type="password" value={password} onChange={(e) => {setPassword(e.target.value)}} className="normal-input" />
                </label>
                <label>
                    Goals
                    <div className="pitch row">
                        <p># of pitches: </p>
                        <span className="input-error-msg">
                        <input disabled={formDisabled} type="number" value={goal} onChange={(e) => {setGoal(e.target.value)}} className={pitchesValid ? 'normal-input' : 'invalid-input'}/>
                        <p id="pitches-error" className={pitchesValid ? 'error hidden' : 'error'}>Whoops! Your weekly goal must be between 10 and 15000 pitches.</p>
                        </span>
                        
                    </div>
                    
                </label>
            </div>
            
        </div>
    )
}

export default Settings