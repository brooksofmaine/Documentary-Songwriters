import React from 'react';
import './LoginForm.css'
import Button from "../Button"
import InputField from "./InputField";

class LoginForm extends React.Component {
    render() {
        return (
            <div className="loginform">
                <h1 className={"Title"}>Documentary Songwriters</h1>
                <div className="login_area flex_container">
                    <div className={"user_login login_section"}>
                        <form className="form">
                            <input className="login-input" type="text" placeholder="Username" name="Username"/>
                            <input className="login-input" type="password" placeholder="Password" name="Password"/>
                            <Button name="Login"/>
                        </form>
                    </div>
                    <div className={"new_user_prompt login_section"}>
                        <h2>New User?</h2>
                        <a href={"#"}>Click here to register a new account</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default LoginForm
