import React from 'react';
import './LoginForm.css'
import Button from "../Button"
// import InputField from "./InputField";
import {
    // BrowserRouter as Router,
    // Switch,
    // Route,
    // Link
  } from "react-router-dom";


class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginState: 0
        };
        this.authenticate = this.authenticate.bind(this);
        this.renderForm = this.renderForm.bind(this);
        this.simulateLogin = this.simulateLogin.bind(this);
    };

    // fake async function to authenticate
    authenticate = (username, password)=> {
        // return({auth : true})
        return new Promise(resolve => {
            setTimeout(() => {
                console.log("Authorizing user...");
                resolve({auth: true});
            }, 1000)
        })
    };

    renderForm = () => {
        if (this.state.loginState === 0) {
            return this.renderLogin()
        } else {
            return this.renderRegister()
        }
    };

    simulateLogin = async () => {
        var user = "";
        var pass = "";
        const loginAuth = await this.authenticate(user, pass);

        if (loginAuth.auth === true) {
            window.location.href = "/api/home"
        }
    };

    renderLogin = () => {
        return(
            <form className="auth-form">
                <input className="login-input" type="text" placeholder="Username" name="Username"/>
                <input className="login-input" type="password" placeholder="Password" name="Password"/>
                <Button name="Login" onClick={this.simulateLogin}/>
                <p>New user?
                    <a href="#" onClick={() => {
                        this.setState({loginState: 1})
                    }}>
                        Sign up here.</a>
                </p>
                <button onClick={() => {this.openGoogleLogin()}}>Use Google to login</button>
            </form>
        )
    };

    renderRegister = () => {
        return(
            <form className="auth-form registration">
                <input className="login-input" type="text" placeholder="Username" name="Email"/>
                <input className="login-input" type="password" placeholder="Password" name="Password"/>
                <input className="login-input" type="password" placeholder="Confirm Password" name="Confirm Password"/>
                <Button name="Register" onClick={this.simulateLogin}/>
                <p>Already have an account?
                <a href="#" onClick={() => {
                    this.setState({loginState: 0})
                }}>
                    Log in here.</a>
            </p>
            </form>
        )
    };

    render = () => {
        return (
            <div className="LoginForm">
                <h1 className="Title">Documentary Songwriters</h1>
                <div className="login-area">
                    <div>
                        {this.renderForm()}
                    </div>
                    {/* TODO: Clean Up: */}
                    <div className="user-prompt">

                        {/* <h2>New User?</h2>
                        <a href="#">Click here to register a new account.</a> */}
                    </div>
                </div>

            </div>
        )
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
