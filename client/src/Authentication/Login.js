import React from "./react"
import Button from '../Button'

function Login() {
    return (
        <div>
            <form className="form">
                <input className="login-input" type="text" placeholder="Username"
                       name="username" onChange={this.handleChange}/>
                <input className="login-input" type="password" placeholder="Password"
                       name="password" onChange={this.handleChange}/>

            </form>
            <Button id="login" onClick={this.authUser} name="Login"/>
            <div className={"new_user_prompt login_section"}>
                <h2>New User?</h2>
                <button className="link-style" onClick={() => this.setState({login: 1})}>Register a new account</button>
            </div>
        </div>
    )
}

export default Login