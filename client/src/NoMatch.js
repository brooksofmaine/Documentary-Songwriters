import React from "react"
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    Redirect,
    useLocation
  } from "react-router-dom";

  function NoMatch() {
      const location = useLocation()

      return(
          <div>
              <h1>Hey</h1>
              <p>No match for {location}</p>
          </div>
      )
  }



export default NoMatch