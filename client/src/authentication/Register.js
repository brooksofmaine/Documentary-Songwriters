import React from 'react';
import Button from '../Button';

function Register(props) {
    return(
        <div>
        <form className="form">
            <input className="login-input Front" type="text"
                    placeholder="Username" name="username" onChange={() => props.handleChange}/>
            <input className="login-input Front" type="text"
                    placeholder="Email" name="email" onChange={() => props.handleChange}/>
            <input className="login-input Front" type="text"
                    placeholder="First Name" name="firstName" onChange={() => props.handleChange}/>
            <input className="login-input Front" type="text"
                    placeholder="Last name" name="lastName" onChange={() => props.handleChange}/>
            <input className="login-input Front" type="password"
                    placeholder="Password" name="password" onChange={() => props.handleChange}/>
            <input className="login-input Front" type="password"
                    placeholder="Confirm Password" name="password_confirm" onChange={() => props.handleChange}/>
        </form>
            <Button id="register" onClick={() => props.createUser} name="Register"/>
            <div className={"new_user_prompt login_section"}>
                <h2 className="Front">Already have an account?</h2>
                <button className="link-style Front" onClick={() => props.changeDisplay(0)}>Click here to log in</button>
                
            </div>
        </div>
    )
}

export default Register;