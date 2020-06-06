import React from 'react';
import './LoginForm.css'
import Button from "../Button"
import GoogleImg from '../assets/google_signin.png';
import LoginImages from './LoginImages';
import Login from './Login';
import Register from './Register';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: 0,
            remember_me: false,
            
            username: "",
            password: "",
            email: "",
            firstName: "",
            lastName: "",
            password_confirm: "",

            badUser : false,
            badPassword: false,
            badEmail: false,
            badFirstName: false,
            badLastName: false,
            badConfirmPassword: false,
            userMessage: "",
            passwordMessage: "",
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

    updateLoginState(num) {
        this.setState({login: num});
    }

    async createUser() {
        /* Check if valid */

        // checks that no fields are empty
        let error = false;
        let missingPassword = false;
        if (this.state.username === "") {
            this.setState({
                badUser: true,
                userMessage: "You need to enter a username"
            })
            error = true;
        }
        if (this.state.firstName === "") {
            this.setState({
                badFirstName: true,
                firstNameMessage: "You need to enter a first name"
            })
            error = true;
        }
        if (this.state.lastName === "") {
            this.setState({
                badLastName: true,
                lastNameMessage: "You need to enter a last name"
            })
            error = true;
        }
        if (this.state.password === "") {
            this.setState({
                badPassword: true,
                passwordMessage: "You need to enter a password"
            })
            error = true;
            missingPassword = true;
        }
        if (this.state.password_confirm === "") {
            this.setState({
                badConfirmPassword: true,
                confirmPasswordMessage: "You need to confirm your password"
            })
            error = true;
            missingPassword = true;
        }
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
                passwordMessage: "Make sure your password includes at least one letter, number, and special character, and is at least 8 characters long",
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
        const response = await fetch('http://localhost:5000/api/user/create', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(userInfo)
        });

        const myJson = await response.json();
        console.log(JSON.stringify(myJson));

        if (response.status === 200) {
            window.location = "/api/home";
        }

    };

    async authUser() {
        let error = false;

        if (this.state.username === "") {
            this.setState({
                badUser: true,
                userMessage: "You need to enter a username"
            })
            error = true;
        }
        if (this.state.password === "") {
            this.setState({
                badPassword: true,
                passwordMessage: "You need to enter a password"
            })
            error = true;
        }
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
        const response = await fetch('http://localhost:5000/api/auth/local', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userInfo),
            credentials: 'include'
        });

        /* TODO: more status code error handling */
        if (response.status !== 200) {
            this.setState({
                badUser: true,
                userMessage: "",
                badPassword: true,
                passwordMessage: "This username and password combination is invalid"
            })
        } else {
            const myJson = await response.json();
            console.log(JSON.stringify(myJson));
            window.location = "/api/home";
        }


    };

    handleChange(e){
        let json = {};
        json[e.target.name] = e.target.value;
        this.setState(json);

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
        if (e.target.name === "username") {
            
        }
        else if (e.target.name === "password") {
            
        }
        else if (e.target.name === "email") {
            
        }
    };

    handleCheckBoxChange(e){
        console.log('checkbox')
        let json = {};
        json['remember_me'] = e.target.checked;
        this.setState(json);
    };

    render() {
        const boyVisible = this.state.login === 0 ? true : false;

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
        
        return (
            <div className="loginform">
                <h1 className={"Title"}>Documentary Songwriters</h1>
                <div className="login_area flex_container">
                    <div className={"user_login login_section"}>
                        <button className="google-button" onClick={() => this.openGoogleLogin()}>
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

    componentDidMount = () => {
        window.addEventListener('message', (event) => {
            if (event.origin.startsWith("http://localhost:5000")) {
                console.log("User " + event.data + " successfully logged in.");
                window.location = "/api/home";
            }
        });
    };

    openGoogleLogin = () => {
        window.open("http://localhost:5000/api/auth/google/", "Login",'height=800,width=500');
    };
}

export default LoginForm;
