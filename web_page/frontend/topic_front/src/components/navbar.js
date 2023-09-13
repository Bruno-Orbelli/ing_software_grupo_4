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
                {isAdmin ?
                    <li className="nav-item active">
                        <button className='btn btn-dark' aria-expanded="false">
                            <Link className="nav-link" to="/users">ABM</Link>
                        </button>
                    </li>
                    : null}
                <div class="collapse navbar-collapse" id="navbarNavDarkDropdown">
                    <ul class="navbar-nav">
                        <li class="nav-item dropdown">
                            <button class="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                Account
                            </button>
                            <ul class="dropdown-menu dropdown-menu-dark">
                                <li><Link class="dropdown-item" to="#">Profile</Link></li>
                                <li><Link class="dropdown-item" to="/login" onClick={() => { logout() }}>Log out</Link></li>
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
                        <button className='btn btn-dark'>
                            <Link className="nav-link" to="#">Search</Link>
                        </button>
                    </li>
                    {logged ? <LoggedInLinks /> : <LoggedOutLinks />}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar