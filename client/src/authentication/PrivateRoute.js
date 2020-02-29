import React from "react"
import {
    Route,
    Redirect
  } from "react-router-dom";

function PrivateRoute({ children, ...rest }) {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          true ? ( //Set var here for whether authenticated or not. 
            children
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }

export default PrivateRoute