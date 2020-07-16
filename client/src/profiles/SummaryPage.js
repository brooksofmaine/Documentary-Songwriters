import React, {useState, useEffect, useRef} from 'react'
import { BrowserRouter as Router, Switch, Route, useRouteMatch } from "react-router-dom";
import ProfileSidebar from './ProfileSidebar'
import MobileProfileSidebar from './MobileProfileSidebar';
import InstrumentPage from './InstrumentPage'
import UserProfile from './UserProfile'
import Settings from './Settings'
import './SummaryPage.css'

function SummaryPage() {
    
    const [mobilePage, setMobilePage] = useState(false);
    
    /* 
     * Repeatedly queries browser to set width of window
     * Used to render in mobile-friendly fashion if necessary
     */
    setInterval(() => {
        const pageWidth = window.innerWidth;
        setMobilePage(pageWidth <= 900 ? true : false);
    }, 500)

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

    // displays menu appropriate for page width
    const menu = mobilePage ? 
        <MobileProfileSidebar /> : 
        <ProfileSidebar />;

    // console.log("Path: ", path)
    // console.log(`URL: ${url}`)
    return(
        <div className="SummaryPage">
            <Router>
                {/* <ProfileSidebar /> */}
                {menu}
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