import React from 'react'
import NavBar from './NavBar'


function NavBarWrapper({ component: Component, ...rest }) {
    return (
        <div>
            <NavBar />
            <Component {...rest} />
        </div>
    )
}

export default NavBarWrapper
