import React from 'react'
import './NavLink.css'

class NavLink extends React.Component {
    render() {
        return (
            <p className="NavLink">
                <a href={this.props.url} className={this.props.status}>{this.props.value}</a>
            </p>
        );
    }
}

export default NavLink;
