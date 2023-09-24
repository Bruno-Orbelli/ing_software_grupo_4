import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth, logout } from './auth';

const LoggedInLinks = () => {

    // Extract role from session
    const [user, role] = useAuth()

    if (user) {
        const isAdmin = role.role
        //console.log(isAdmin)
        return (
            <>
                <li className="nav-item">
                    <Link id='login-link' className="nav-link" to="#">Search</Link>
                </li>
                {isAdmin ?
                    <li className="nav-item active">
                        <Link id='login-link' className="nav-link" to="/users">ABM</Link>
                    </li>
                    : null}
                <div className="collapse navbar-collapse" id="navbarNavDarkDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item dropdown">
                            <Link id='account-link' className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                Account
                            </Link>
                            <ul id='drop' className="dropdown-menu dropdown-menu-dark">
                                <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                                <li><Link className="dropdown-item" to="/login" onClick={() => { logout() }}>Log out</Link></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </>
        )
    }

}

const LoggedOutLinks = () => {
    return (
        <>
            <li>
                <Link id='login-link' className="nav-link" to="/login">Login</Link>
            </li>
        </>
    )
}

const Navbar = () => {

    const [logged] = useAuth()

    return (
        <nav id='Nav' className="navbar navbar-expand-lg navbar-dark bg-dark p-3">
            <link href='https://fonts.googleapis.com/css?family=Roboto Mono' rel='stylesheet'></link>
            <Link id='Topic' className="navbar-brand" to="/">Topic</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav">
                    {logged ? <LoggedInLinks /> : <LoggedOutLinks />}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar