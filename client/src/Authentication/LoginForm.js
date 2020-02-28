import React from 'react';
import './LoginForm.css'
import Button from "../Button"
import GoogleImg from '../assets/google_signin.png'

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: 0
        };

        // Function bindings
        this.loginState = this.loginState.bind(this);
        this.updateLoginState = this.updateLoginState.bind(this);
        this.Login = this.Login.bind(this);
        this.Register = this.Register.bind(this);
        this.createUser = this.createUser.bind(this);
        this.authUser = this.authUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.openGoogleLogin = this.openGoogleLogin.bind(this);
    }

    loginState() {
        if (this.state.login === 0) {
            return this.Login();
        } else {
            return this.Register();
        }
    }

    updateLoginState(num) {
        this.setState({login: num});
    }

    async createUser() {
        /* Check if valid */
        /* TODO: check email format; interactive alert of invalid fields */
        const fields = ['username', 'password', 'password_confirm', 'firstName', 'lastName', 'email'];

        for (const field of fields) {
            if (!this.state.hasOwnProperty(field) || this.state[field] === "") {
                alert("Something's not filled in");
                console.log(field);
                console.log(this.state);
                return;
            }
        }
        if (this.state.password !== this.state.password_confirm) {
            alert("password don't match");
            console.log(this.state);
            return;
        }

        /* Construct JSON object */
        const userInfo = {
            "username": this.state.username,
            "password": this.state.password,
            "firstName": this.state.firstName,
            "lastName": this.state.lastName,
            "email": this.state.email
        };

        console.log(userInfo);

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
        const fields = ['username', 'password'];

        for (const field of fields) {
            if (!this.state.hasOwnProperty(field) || this.state[field] === "") {
                alert("Something's not filled in");
                console.log(field);
                console.log(this.state);
                return;
            }
        }

        /* Construct JSON with user info*/
        const userInfo = {
            "username": this.state.username,
            "password": this.state.password
        };

        console.log(userInfo);


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
            alert("Wrong password");
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
    };

    Login() {
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
    };

    Register() {
        return (
            <div>
            <form className="form">
                <input className="login-input" type="text"
                       placeholder="Username" name="username" onChange={this.handleChange}/>
                <input className="login-input" type="text"
                       placeholder="Email" name="email" onChange={this.handleChange}/>
                <input className="login-input" type="text"
                       placeholder="First Name" name="firstName" onChange={this.handleChange}/>
                <input className="login-input" type="text"
                       placeholder="Last name" name="lastName" onChange={this.handleChange}/>
                <input className="login-input" type="password"
                       placeholder="Password" name="password" onChange={this.handleChange}/>
                <input className="login-input" type="password"
                       placeholder="Confirm Password" name="password_confirm" onChange={this.handleChange}/>
            </form>
                <Button id="register" onClick={this.createUser} name="Register"/>
                <div className={"new_user_prompt login_section"}>
                    <h2>Already have an account?</h2>
                    <button className="link-style" onClick={() => this.setState({login: 0})}>Click here to log in</button>
                    
                </div>
            </div>
        )
    };

    render() {
        return (
            <div className="loginform">
                <h1 className={"Title"}>Documentary Songwriters</h1>
                <div className="login_area flex_container">
                    <div className={"user_login login_section"}>
                    <button className="google-button" onClick={() => this.openGoogleLogin()}>
                        <img src={GoogleImg} alt="Google Login Button" />
                    </button>
                        {this.loginState()}
                    </div>
                </div>
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

export default LoginForm
