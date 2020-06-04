import React, {useState} from 'react'
import { BrowserRouter as Router, Switch, Route, useRouteMatch } from "react-router-dom";
import ProfileSidebar from './ProfileSidebar'
import InstrumentPage from './InstrumentPage'
import UserProfile from './UserProfile'
import Settings from './Settings'
import './SummaryPage.css'

function SummaryPage() {
    // TODO: Unfinished, needs overhaul
    const useSwitchInstruments = (callback) => {
        const [inputs, setInputs] = useState({});

        const handleSubmit = (event) => {
            if (event) {
              event.preventDefault();
            }
            callback();
          }
        return null;
    }
    const { path, url } = useRouteMatch();
    // console.log("Path: ", path)
    // console.log(`URL: ${url}`)
    return(
        <div className="SummaryPage">
            <Router>
                <ProfileSidebar />
                <Switch>
                    <Route path={`${path}/settings`} component={Settings} />
                    
                    <Route exact path={path} component={InstrumentPage} />
                    <Route path={`${path}/:username`} component={UserProfile} />
                </Switch>
            </Router>
            
        </div>

    )
}

export default SummaryPage