import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {

    const [isLogged, setIsLogged] = useState(false);

    // Handle login
    const handleLogin = () => {
        setIsLogged(true);
    }

    // Handle logout
    const handleLogout = () => {
        setIsLogged(false);
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3">
            <a className="navbar-brand" href="/">Topic</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" href="#">Search</a>
                </li>
                { isLogged ? ( // If user is logged
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Account
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <a className="dropdown-item" href="#">Profile</a>
                    <a className="dropdown-item" href="#">Logout</a>
                    </div>
                <li className="nav-item active">
                    <a className="nav-link" link="/users">ABM</a>
                </li>
                </li>
                ) : ( // If user is not logged
                    <a className="nav-link" href="/login">Login</a>
                )}
                </ul>
            </div>
            </nav>
    )
}

export default Navbar