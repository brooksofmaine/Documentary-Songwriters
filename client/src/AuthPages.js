import React from 'react'
import NavBar from './NavBar'
import LoginForm from './authentication/LoginForm'
import WelcomeBoard from './welcome-page/WelcomeBoard'
import Record from './pitch-page/Record'
import Group from './groups-page/Group'
import UserProfile from './profiles/UserProfile'
import NewGroup from './groups-page/NewGroup'
import NoMatch from './NoMatch'
import InstrumentPage from './profiles/InstrumentPage'
import ProfileSidebar from './profiles/ProfileSidebar'
import Creators from './creators/Creators';
import Settings from './profiles/Settings'
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
                    <Route path="/api/creators" component={Creators} />
                        <Route path="/api/profile/settings/" exact>
                            <div className="profile-components">
                                <ProfileSidebar />
                                <Settings />
                            </div>
                        </Route>
                        <Route path="/api/profile/" exact>
                            <div className="profile-components">
                            <ProfileSidebar />
                            <InstrumentPage />
                            </div>
                        </Route>
                        {/* Route page for viewing your own profile */}
                        <Route path="/api/profile/user/:username" render={(matchProps) => {
                            return(
                                <div className="profile-components">
                                    <ProfileSidebar />
                                    <UserProfile {...matchProps} />
                                </div>
                            )
                        }} />
                        {/* Route page for viewing someone else's profile */}
                        <Route path="/api/user/:username" render={(matchProps) => {
                            return(
                                <div className="profile-components">
                                    <UserProfile {...matchProps} />
                                </div>
                            )
                        }} />

                    {/* Route path for if you reach a page that you're not supposd to be on */}
                    <Route component={NoMatch} />
                    </Switch>
                </Router>
            </div>
        )
    }
}

export default AuthPages