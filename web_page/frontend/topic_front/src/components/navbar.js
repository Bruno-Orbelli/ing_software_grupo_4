import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth, logout } from './auth';

const LoggedInLinks = () => {
    return (
        <>
            <li className="nav-item active">
                <Link className="nav-link" to="/users">ABM</Link>
            </li>
            <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Account
                </Link>
                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <Link className="dropdown-item" to="#">Profile</Link>
                    <Link className="dropdown-item" to="#">Logout</Link>
                </div>
            </li>
            <li>
                <Link className="nav-link" to="/login" onClick={() => {logout()}}>Log out</Link>
            </li>
        </>
    )
}

const LoggedOutLinks = () => {
    return (
        <>
            <li>
                <Link className="nav-link" to="/login">Login</Link>
            </li>
        </>
    )
}

const Navbar = () => {

    const [logged] = useAuth()

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3">
            <Link className="navbar-brand" to="/">Topic</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="#">Search</Link>
                    </li>
                    {logged ? <LoggedInLinks /> : <LoggedOutLinks />}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar