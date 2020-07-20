import React from 'react';
import './LoginForm.css'
import Button from "../Button"
import GoogleImg from '../assets/google_signin.png';
import LoginImages from './LoginImages';
import Login from './Login';
import Register from './Register';
import UserFunc from "../api-helper/user";
import {server_add} from "../api-helper/config";

/*
 * Top-level component to manage login screen
 * First page scene when logging in
 * Displayed at "/"
 * Only screen viewable to users who aren't logged in
 * Allows for login authentication and registering manually or via Google
 * Handles field validation
 */
class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: 0,           // 0 if showing Login component, 1 if showing Register component
            remember_me: false, // corresponds to remember me checkbox value

            username: "",   // handles username field
            password: "",   // handles password field
            email: "",      // handles email field
            firstName: "",  // handles first name field
            lastName: "",   // handles last name field
            password_confirm: "",     // handles password confirmation field

            badUser : false,                // one "bad" state variable for each possible field
            badPassword: false,             // true if something wrong with input; otherwise false
            badEmail: false,                // username and password work for both Login and Register components
            badFirstName: false,
            badLastName: false,
            badConfirmPassword: false,
            userMessage: "",                // message to display if "bad" variable for this field is true
            passwordMessage: "",            // explains in red error text to user what they did wrong
            emailMessage: "",
            firstNameMessage: "",
            lastNameMessage: "",
            confirmPasswordMessage: ""

        };

        // Function bindings
        this.updateLoginState = this.updateLoginState.bind(this);
        this.createUser = this.createUser.bind(this);
        this.authUser = this.authUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.openGoogleLogin = this.openGoogleLogin.bind(this);
        this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    }

    /*
     * Sets visible form component to either Login or Register
     * Changed on click by button at bottom allowing user to choose to make new account or login
     */
    updateLoginState(num) {
        this.setState({login: num});
    }

    /*
     * Creates user when user manually creates their account
     * Authenticates fields and produces error message if necessary
     * Sends available info to database to create user in users table
     */
    async createUser() {

        // checks that no fields are empty
        let error = false;           // makes it so it returns early if there are any errors
        let missingPassword = false; // won't check for password errors if password is empty

        // checks for empty username field
        if (this.state.username === "") {
            this.setState({
                badUser: true,
                userMessage: "You need to enter a username"
            })
            error = true;
        }
        // checks for empty first name field
        if (this.state.firstName === "") {
            this.setState({
                badFirstName: true,
                firstNameMessage: "You need to enter a first name"
            })
            error = true;
        }
        // checks for empty last name field
        if (this.state.lastName === "") {
            this.setState({
                badLastName: true,
                lastNameMessage: "You need to enter a last name"
            })
            error = true;
        }
        // checks for empty password field
        if (this.state.password === "") {
            this.setState({
                badPassword: true,
                passwordMessage: "You need to enter a password"
            })
            error = true;
            missingPassword = true;
        }
        // checks for empty password confirmation field
        if (this.state.password_confirm === "") {
            this.setState({
                badConfirmPassword: true,
                confirmPasswordMessage: "You need to confirm your password"
            })
            error = true;
            missingPassword = true;
        }
        // checks for empty email field
        if (this.state.email === "") {
            this.setState({
                badEmail: true,
                emailMessage: "You need to enter an email"
            })
            error = true;
        }
        // checks format of email
        else if (!(/^[\.\-_a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(this.state.email))) {
            this.setState({
                badEmail: true,
                emailMessage: "Please enter a valid email"
            })
            error = true;
        }
        // checks for strong password
        if ( !missingPassword && !(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(this.state.password))) {
            this.setState({
                badPassword: true,
                passwordMessage: "Make sure your password includes at least one letter, number, and special character, and is 8-16 characters long",
                badConfirmPassword: true,
                confirmPasswordMessage: ""
            });
            error = true;
        }
        // check that passwords match
        else if (this.state.password !== this.state.password_confirm) {
            this.setState({
                badPassword: true,
                passwordMessage: "",
                badConfirmPassword: true,
                confirmPasswordMessage: "Passwords must match"
            });
            error = true;
        }
        // doesn't try to create user if anything is wrong
        if (error) {
            return;
        }

        /* Construct JSON object */
        // Weekly achievement is 0 by default.
        const userInfo = {
            "username": this.state.username,
            "password": this.state.password,
            "firstName": this.state.firstName,
            "lastName": this.state.lastName,
            "email": this.state.email,
            "weeklyAchievement": 0
        };

        /* Send it */
        const response = await fetch(server_add + '/api/user/create', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(userInfo)
        });

        const myJson = await response.json();
        // console.log(JSON.stringify(myJson));

        // if successful, go back to login page so user can login
        if (response.status === 200) {
            window.location = "/";
        }
        // if username is already taken, issue error message
        else if (response.status === 409) {
            this.setState({
                badUser: true,
                userMessage: "Sorry, that username is already taken"
            })
        }

    };

    /*
     * Authenticates user's credentials (username and password)
     * Handles producing errors for user if there's something wrong
     * If successful, redirects to homepage
     * Called when (existing) user tries to login
     */
    async authUser() {
        let error = false; // ensures returns early if there's something wrong

        // checks for empty username
        if (this.state.username === "") {
            this.setState({
                badUser: true,
                userMessage: "You need to enter a username"
            })
            error = true;
        }
        // checks for empty password
        if (this.state.password === "") {
            this.setState({
                badPassword: true,
                passwordMessage: "You need to enter a password"
            })
            error = true;
        }
        // returns if necessary before even checking database
        if (error) {
            return;
        }

        /* Construct JSON with user info*/
        const userInfo = {
            "username": this.state.username,
            "password": this.state.password,
            "remember_me": this.state.remember_me
        };

        /* Send to server */
        const response = await fetch(server_add + '/api/auth/local', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userInfo),
            credentials: 'include'
        });

        // if there's no match in the database, produce error for user
        // this could be incorrect password or nonexistent user
        if (response.status !== 200) {
            this.setState({
                badUser: true,
                userMessage: "",
                badPassword: true,
                passwordMessage: "This username and password combination is invalid"
            })
        // if successful, login and redirect to homepage
        } else {
            const myJson = await response.json();
            console.log(JSON.stringify(myJson));
            window.location = "/api/home";
        }
    };

    /*
     * Handles all changes within Login and Register forms
     * Triggered on change from either component e.g. typing in any field
     * Updates value of appropriately named state variable based on event target
     * If that field had an error before, gets rid of the error on its change
     */
    handleChange(e){
        // updates corresponding state variable
        let json = {};
        json[e.target.name] = e.target.value;
        this.setState(json);

        // takes away error styling since user is making corrections
        switch (e.target.name) {
            case "username":
                this.setState({
                    badUser: false
                });
                break;
            case "email":
                this.setState({
                    badEmail: false
                });
                break;
            case "firstName":
                this.setState({
                    badFirstName: false
                });
                break;
            case "lastName":
                this.setState({
                    badLastName: false
                });
                break;
            case "password":
                this.setState({
                    badPassword: false
                });
                break;
            case "password_confirm":
                this.setState({
                    badConfirmPassword: false
                });
                break;
            default:
                break;
        }
    };

    /*
     * Handles changes for the remember me checkbox
     * Activates through the Login child component
     * Kept separate from above function to improve functionality
     */
    handleCheckBoxChange(e){
        let json = {};
        json['remember_me'] = e.target.checked;
        this.setState(json);
    };

    render() {
        /*
         * Hides the graphic boy when Register component is showing
         * Shows the graphic boy when Login component is showing
         */
        const boyVisible = this.state.login === 0 ? true : false;

        /*
         * Passes in handle change and submit functions as props
         * Passes in error handling behavior traits as props
         */
        const displayedComponent = this.state.login === 0 ?
            <Login
                handleChange={this.handleChange}
                handleCheckBoxChange={this.handleCheckBoxChange}
                authUser={this.authUser}
                changeDisplay={this.updateLoginState}
                errorMessage={this.state.errorMessage}
                badUser={this.state.badUser}
                userMessage={this.state.userMessage}
                badPassword={this.state.badPassword}
                passwordMessage={this.state.passwordMessage}
            /> :
            <Register
                handleChange={this.handleChange}
                createUser={this.createUser}
                changeDisplay={this.updateLoginState}
                errorMessage={this.state.errorMessage}
                badUser={this.state.badUser}
                userMessage={this.state.userMessage}
                badEmail={this.state.badEmail}
                emailMessage={this.state.emailMessage}
                badFirstName={this.state.badFirstName}
                firstNameMessage={this.state.firstNameMessage}
                badLastName={this.state.badLastName}
                lastNameMessage={this.state.lastNameMessage}
                badPassword={this.state.badPassword}
                passwordMessage={this.state.passwordMessage}
                badConfirmPassword={this.state.badConfirmPassword}
                confirmPasswordMessage={this.state.confirmPasswordMessage}
            />

        /*
         * Renders entire page, including Login or Register, Google Button, and images
         */
        return (
            <div className="loginform">
                <h1 className="Title Front">Documentary Songwriters</h1>
                <div className="login_area flex_container">
                    <div className={"user_login login_section"}>
                        <button className="google-button Front" onClick={() => this.openGoogleLogin()}>
                            <img src={GoogleImg} alt="Google Login Button" />
                        </button>
                        <div onChange={this.handleChange} onClick={this.handleCheckBoxChange}>
                            {displayedComponent}
                        </div>
                    </div>
                </div>
                <LoginImages boyVisible={boyVisible} />
            </div>
        );
    };

    componentDidMount = async () => {
        const curr_user = UserFunc.getCurrentUser();
        if (curr_user && 'status' in curr_user && curr_user['status'] == "logged_in") {
            window.location.href = "/api/home";
        }
    };

    /*
     * Handles login via Google button
     */
    openGoogleLogin = () => {
        window.open(server_add + "/api/auth/google/", "Login",'height=800,width=500');
    };
}

export default LoginForm;
