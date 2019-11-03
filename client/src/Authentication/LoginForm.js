import React from 'react';
import './LoginForm.css'
import Button from "../Button"
// import InputField from "./InputField";
import {
    // BrowserRouter as Router,
    // Switch,
    // Route,  
    Link
  } from "react-router-dom";


class LoginForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loginFunction: 0
        }
    }
    
    login() {
        return(
            <form className="form">
            <input className="login-input" type="text" placeholder="Username" name="Username"/>
            <input className="login-input" type="password" placeholder="Password" name="Password"/>
            <Link to="/api/home">
                <Button name="Login"/>
            </Link>
            </form>
        )
    }

    register() {
        return(
            <form>
            <input className="login-input" type="text" placeholder="Username" name="Email"/>
            <input className="login-input" type="password" placeholder="Password" name="Password"/>
            <input className="login-input" type="password" placeholder="Confirm Password" name="Confirm Password"/>
            <Link to="/api/home">
                <Button name="Register"/>
            </Link>
            </form>
        )
    }

    // handleClick(loginState) {
    //     this.setState({})
    // }

    render() {
        return (
            <div className="loginform">
                <h1 className={"Title"}>Documentary Songwriters</h1>
                <div className="login_area flex_container">
                    <div className={"user_login login_section"}>
                        {this.login()}
                    </div>
                    <div className={"new_user_prompt login_section"}>
                        <h2>New User?</h2>
                        {/* eslint-disable-next-line */}
                        <a href={"#"} >Click here to register a new account</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default LoginForm
