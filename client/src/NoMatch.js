import React from "react"
import { useLocation } from "react-router-dom";
import ErrorImg from './assets/page-not-found.svg'

function NoMatch() {
      const location = useLocation()


      return(
          <div className="NoMatch">
              <h2>Whoops! We couldn't find a page at {location.pathname}</h2>
              <img src={ErrorImg} alt="Woman sitting on top of 404 sign" />
          </div>
      )
  }



export default NoMatch