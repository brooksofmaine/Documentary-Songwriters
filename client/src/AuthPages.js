import React from "react"
import NavBar from './NavBar'
import LoginForm from './Authentication/LoginForm'
import WelcomeBoard from './WelcomeBoard'
import Record from './Record'
import {
    BrowserRouter as Router,
    Switch,
    Route,  
  } from "react-router-dom";

class AuthPages extends React.Component {

    render() {
        return(
            <div className="AuthPages">
                <Router>
                    <NavBar />
                    <Switch>
                    <Route exact path="/" component={LoginForm} />
                    <Route path="/api/home">
                        <WelcomeBoard />
                    </Route>
                    <Route path="/api/record" component={Record} />
                    </Switch>
                </Router>
            </div>
        )
    }
}

export default AuthPages