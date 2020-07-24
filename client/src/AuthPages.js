import React, {useEffect} from 'react'
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
import PrivateRoute from './PrivateRoute'
import ProfileWrapper from './profiles/ProfileWrapper'
import NavBarWrapper from './NavBarWrapper'
import {
    BrowserRouter as Router,
    Switch,
    Route,  
  } from "react-router-dom";

  const AuthPages = (props) => {

    useEffect(() => {
        console.log("Props.loggedIn:", props.loggedIn)
    }, [props.loggedIn])

        const homeComponent = (({...rest}) => <NavBarWrapper component={WelcomeBoard} {...rest}/>)
        const practiceComponent = (({...rest}) => <NavBarWrapper component={Record} {...rest} />)
        const groupComponent = (({...rest}) => <NavBarWrapper component={Group} {...rest}/>)
        const newGroupComponent = (({...rest}) => <NavBarWrapper component={NewGroup} {...rest}/>)
        const creatorsComponent = (({...rest}) => <NavBarWrapper component={Creators} {...rest}/>)
        const settingsComponent = (({...rest}) => (
            <div>
                <NavBar />
                <div className="profile-components">
                <ProfileSidebar />
                <Settings {...rest}/>
                </div>
            </div>
        ))
        const profileComponent = (({...rest}) => (
            <div>
                <NavBar />
                <div className="profile-components">
                    <ProfileSidebar />
                    <InstrumentPage {...rest}/>
                </div>
            </div>
        ))

        const externalProfile = (({...rest}) => (
            <ProfileWrapper visibility="external" {...rest}/>
        ))
        const internalProfile = (({...rest}) => (
            <ProfileWrapper visibility="internal" {...rest}/>
        ))
        return(
            <div className="AuthPages">
                <Router>
                    <Route exact path="/" component={LoginForm} />
                    <Switch>
                    
                    
                    <PrivateRoute path="/api/home" component={homeComponent}/>
                    <PrivateRoute path="/api/practice" component={practiceComponent}/>
                    <PrivateRoute path="/api/groups" exact component={groupComponent} />
                    <PrivateRoute path="/api/groups/new" component={newGroupComponent} />
                    <PrivateRoute path="/api/creators" component={creatorsComponent} />
                    <PrivateRoute path="/api/profile/settings" exact component={settingsComponent} />
                    <PrivateRoute path="/api/profile/" exact component={profileComponent} />
                    <PrivateRoute path="/api/profile/user/:username" component={externalProfile} />
                    <PrivateRoute path="/api/user/:username" component={internalProfile} />

                    {/* Route path for if you reach a page that you're not supposd to be on */}
                    <Route component={NoMatch} />
                    </Switch>
                </Router>
            </div>
        )
}

export default AuthPages