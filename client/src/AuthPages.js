import React from "react"
import NavBar from './NavBar'
import LoginForm from './Authentication/LoginForm'
import WelcomeBoard from './WelcomeBoard'
import Record from './Record'
import Group from './Groups/Group'
import UserProfile from './profiles/UserProfile.js'
import NewGroup from './Groups/NewGroup'
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
                    <Route path="/api/groups" exact component={Group} />
                    <Route path="/api/groups/new" component={NewGroup} />
                    <Route path="/api/profile" component={UserProfile} />

                    </Switch>
                </Router>
            </div>
        )
    }
}

export default AuthPages