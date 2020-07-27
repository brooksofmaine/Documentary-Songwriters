import React from 'react'
import {Redirect, Route} from 'react-router-dom'
// import UserFunc from './api-helper/user'


export const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
        <Route {...rest} render={props => (
            localStorage.getItem("isLoggedIn") === "true" ?
                <Component {...props} />
            : <Redirect to="/" />
        )} />
    );
}

export default PrivateRoute