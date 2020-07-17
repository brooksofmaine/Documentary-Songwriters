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
    const [password, setPassword] = useState("") 

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
            if (password != "") {
                UserFunc.changeInfo("password", password)
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


    // TODO: Validate all inputs, also inputs for pitch counting
    return(
        <div className="Settings">
            <button className="settings-btn" onClick={handleButton}>
                {formDisabled ? 
                    <FontAwesomeIcon icon={faEdit} size="2x"/> :
                    "Save"}
            </button>
            <form className="settings-form">
                <div className="name-block">
                    <label>Name</label>
                    <div className="name row">
                        <input disabled={formDisabled} 
                               placeholder="First Name" 
                               type="text" 
                               value={firstName} 
                               onChange={(e) => {setFirstName(e.target.value)}} 
                               className={firstNameValid ? 'normal-input' : 'invalid-input'}
                               />
                        <input disabled={formDisabled} 
                               type="text" 
                               value={lastName} 
                               onChange={(e) => {setLastName(e.target.value)}} 
                               className={lastNameValid ? 'normal-input' : 'invalid-input'}/>
                    </div>
                    <span className="name-error">
                        <p className={firstNameValid ? 'error hidden' : 'error'}>
                            First name must be between 0 and 20 characters
                        </p>
                        <p className={lastNameValid ? 'error hidden' : 'error'}>
                            Last name must be between 0 and 20 characters
                        </p>
                    </span>
                </div>
                <div className="username-block">
                    <label for="username-field">Username</label>
                    <input disabled={true} 
                       type="text" 
                       id="username-field"
                       value={username} 
                       onChange={(e) => {setUsername(e.target.value)}} 
                       className="normal-input" />
                </div>
                <div className="email-block">
                    <label for="email-field">Email</label>
                    <input disabled={formDisabled} 
                           type="text" 
                           value={email} 
                           id="email-field"
                           onChange={(e) => {setEmail(e.target.value)}} 
                           className={emailValid ? 'normal-input' : 'invalid-input'}/>
                    <p className={emailValid ? 'error hidden' : 'error'}>
                        Please enter a valid email address
                    </p>
                </div>
                <div className="password-block">
                    <label for="password-field">Password</label>
                    <input disabled={formDisabled} 
                           type="password" 
                           id="password-field"
                           value={password} 
                           onChange={(e) => {setPassword(e.target.value)}} 
                           className="normal-input" />
                </div>
                <div className="goal-block">
                    <label for="weekly-goal">Weekly Goal</label>
                    <input disabled={formDisabled} 
                           id="weekly-goal"
                           type="number" 
                           value={goal} 
                           onChange={(e) => {setGoal(e.target.value)}} 
                           className={pitchesValid ? 'normal-input' : 'invalid-input'}/>
                    <p id="pitches-error" className={pitchesValid ? 'error hidden' : 'error'}>
                        Whoops! Your weekly goal must be between 10 and 15000 pitches.
                    </p>
                </div>
            </form>
            
        </div>
    )
}

export default Settings