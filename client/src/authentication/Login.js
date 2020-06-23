import React from 'react';
import './LoginForm.css';
import '../Forms.css';
import Button from '../Button';

/* 
 * Second-level component for login form fields
 * Child of LoginForm
 */
function Login(props) {
    // makes corresponding field text in red and un-hides error message if there's a problem 
    const userStyle  = props.badUser ? { color: '#f00' } : { color: '#000' };
    const userErrorStyle = props.badUser ? { display : 'block' } : { display : 'none' };
    const passwordStyle  = props.badPassword ? { color: '#f00' } : { color: '#000' };
    const passwordErrorStyle = props.badPassword ? { display : 'block' } : { display : 'none' };
    
    /*
     * Renders username and password fields and remember me option
     * Renders errors if necessary from props logic
     * Allows option to switch to Register component
     */
    return (
        <div>
            <form className="form">
                <label className="Label">Username</label>
                <input 
                    className="login-input Front" 
                    type="text" 
                    placeholder="Username"
                    name="username" 
                    style={userStyle} 
                />
                <div className="ErrorMessage" style={userErrorStyle}>
                    {props.userMessage}
                </div>

                <label className="Label">Password</label>
                <input 
                    className="login-input Front" 
                    type="password" 
                    placeholder="Password"
                    name="password" 
                    style={passwordStyle}
                />
                <div className="ErrorMessage" style={passwordErrorStyle}>
                    {props.passwordMessage}
                </div>

                <label htmlFor="remember_me">
                    <input id="remember_me" type="checkbox" name="remember_me"/>
                    <div id="remember-me-text">Remember Me</div>
                </label>
            </form>
            <Button id="login" onClick={() => props.authUser()} name="Login"/>
            <div className="new_user_prompt login_section">
                <h2 className="Front SolidBackground AccountText">New User?</h2>
                <br />
                <button className="link-style Front SolidBackground" onClick={() => props.changeDisplay(1)}>Register a new account</button>
            </div>
        </div>
    )
}


export default Login;