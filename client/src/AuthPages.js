import React from 'react'
import NavBar from './NavBar'
import LoginForm from './authentication/LoginForm'
import WelcomeBoard from './welcome-page/WelcomeBoard'
import Record from './pitch-page/Record'
import Group from './groups-page/Group'
// import UserProfileContainer from './profiles/UserProfileContainer.js'
import UserProfile from './profiles/UserProfile'
import NewGroup from './groups-page/NewGroup'
import SummaryPage from './profiles/SummaryPage'
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
                    <Route path="/api/practice" component={Record} />
                    <Route path="/api/groups" exact component={Group} />
                    <Route path="/api/groups/new" component={NewGroup} />
                    
                    <Route path="/api/profile" component={SummaryPage} />
                    </Switch>
                </Router>
            </div>
        )
    }
}

export default AuthPages