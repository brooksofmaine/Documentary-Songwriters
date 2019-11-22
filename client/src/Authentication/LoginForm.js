import React from 'react';
import './LoginForm.css'
import Button from "../Button"
// import InputField from "./InputField";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link

  } from "react-router-dom";

// TODO: This isn't stylisticly how these are supposed to be in
// the file--refactor this code
function Login() {
    return(
        <form className="form">
            <Button id="google" onClick={() => {this.openGoogleLogin()}} name="Login with Google"/>
            <input className="login-input" type="text" placeholder="Username" name="Username"/>
            <input className="login-input" type="password" placeholder="Password" name="Password"/>
            <Link to="/api/home">
                <Button name="Login"/>
            </Link>
        </form>
    )
}

function Register() {
    return(
        <form className="Register">
            <Button id="google" onClick={() => {this.openGoogleLogin()}} name="Login with Google"/>
            <input className="login-input" type="text" placeholder="Username" name="Email"/>
            <input className="login-input" type="password" placeholder="Password" name="Password"/>
            <input className="login-input" type="password" placeholder="Confirm Password" name="Confirm Password"/>
            <Link to="/api/home">
                <Button name="Register"/>
            </Link>
        </form>
    )
}

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: 0
        };
        this.loginState = this.loginState.bind(this);
        this.updateLoginState = this.updateLoginState.bind(this);
    }
    // handleClick(loginState) {
    //     this.setState({})
    // }

    loginState() {
        if (this.state.login === 0) {
            return Login();
        } else {
            return Register();
        }
    }

    updateLoginState(num) {
        this.setState({login: num});
    }

    render() {
        return (
            <div className="loginform">
                <h1 className={"Title"}>Documentary Songwriters</h1>
                <div className="login_area flex_container">
                    <div className={"user_login login_section"}>
                        {this.loginState()}
                    </div>
                    <div className={"new_user_prompt login_section"}>
                        <h2>New User?</h2>
                        <a href={"#"} onClick={() => this.setState({login: 1})} >Click here to register a new account</a>

                    </div>
                </div>

            </div>
        );
    };

    openGoogleLogin = () => {
        window.open("http://localhost:5000/auth/google/", "Login",'height=800,width=500');
    };

    componentDidMount = () => {
        window.addEventListener('message', (event) => {
            console.log(event.data);
            if (event.origin.startsWith("http://localhost:5000")) {
                console.log("User " + event.data + " successfully logged in.");
                window.location = "/api/home";
            }
        });
    }
}

export default LoginForm
