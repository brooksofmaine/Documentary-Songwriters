import React from 'react';
import Button from '../Button';

/* 
 * Second-level component for login form fields
 * Child of LoginForm
 */
function Register(props) {
    // makes corresponding field text in red and un-hides error message if there's a problem 
    const userStyle  = props.badUser ? { color: '#f00' } : { color: '#000' };
    const userErrorStyle = props.badUser ? { display : 'block' } : { display : 'none' };
    const emailStyle  = props.badEmail ? { color: '#f00' } : { color: '#000' };
    const emailErrorStyle = props.badEmail ? { display : 'block' } : { display : 'none' };
    const firstNameStyle  = props.badFirstName ? { color: '#f00' } : { color: '#000' };
    const firstNameErrorStyle = props.badFirstName ? { display : 'block' } : { display : 'none' };
    const lastNameStyle  = props.badLastName ? { color: '#f00' } : { color: '#000' };
    const lastNameErrorStyle = props.badLastName ? { display : 'block' } : { display : 'none' };
    const passwordStyle  = props.badPassword ? { color: '#f00' } : { color: '#000' };
    const passwordErrorStyle = props.badPassword ? { display : 'block' } : { display : 'none' };
    const confirmPasswordStyle  = props.badConfirmPassword ? { color: '#f00' } : { color: '#000' };
    const confirmPasswordErrorStyle = props.badConfirmPassword ? { display : 'block' } : { display : 'none' };

    /*
     * Renders username, email, first name, last name, password, and confirm password fields
     * Renders errors if necessary from props logic
     * Allows option to switch to Login component
     */
    return(
        <div>
            <form className="form">
                <input className="login-input Front" type="text"
                        placeholder="Username" name="username" style={userStyle} />
                <div className="ErrorMessage" style={userErrorStyle}>
                    {props.userMessage}
                </div>
                <input className="login-input Front" type="text"
                        placeholder="Email" name="email" style={emailStyle} />
                <div className="ErrorMessage" style={emailErrorStyle}>
                    {props.emailMessage}
                </div>
                <input className="login-input Front" type="text"
                        placeholder="First Name" name="firstName"style={firstNameStyle} />
                <div className="ErrorMessage" style={firstNameErrorStyle}>
                    {props.firstNameMessage}
                </div>
                <input className="login-input Front" type="text"
                        placeholder="Last name" name="lastName" style={lastNameStyle} />
                <div className="ErrorMessage" style={lastNameErrorStyle}>
                    {props.lastNameMessage}
                </div>
                <input className="login-input Front" type="password"
                        placeholder="Password" name="password" style={passwordStyle} />
                <div className="ErrorMessage" style={passwordErrorStyle}>
                    {props.passwordMessage}
                </div>
                <input className="login-input Front" type="password"
                        placeholder="Confirm Password" name="password_confirm" style={confirmPasswordStyle} />
                <div className="ErrorMessage" style={confirmPasswordErrorStyle}>
                    {props.confirmPasswordMessage}
                </div>
            </form>
            <Button id="register" onClick={() => props.createUser()} name="Register"/>
            <div className={"new_user_prompt login_section"}>
                <h2 className="Front">Already have an account?</h2>
                <button className="link-style Front" onClick={() => props.changeDisplay(0)}>Click here to log in</button>
                
            </div>
        </div>
    )
}

export default Register;