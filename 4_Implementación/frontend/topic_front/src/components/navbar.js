import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useAuth, logout } from './auth';
import { useState } from 'react';
import { Collapse } from 'bootstrap';
import Swal from 'sweetalert2';

const LoggedInLinks = ({ user, role }) => {
    
    const [clickedOnSearch, setClickedOnSearch] = useState(false)

    const [users, setUsers] = useState([]);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    
    const performSearch = (data) => {
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')
        
        console.log(JSON.parse(token).access_token)

        const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(token).access_token}`
            }
        }
        
        fetch('/users/users?' + new URLSearchParams({"uname": data.search_input}), requestOptions)
        .then(response => Promise.all([
            response.json(),
            response.status
        ]))
        .then(data => {
            const body = data[0]
            const status = data[1]
            if (status === 200) {
                setUsers(body)
            }
            else {
                fireToastError(body)
            }
        })
    }

    const setClickedAndCloseCollapse = (clicked) => {
        setClickedOnSearch(clicked)
        var collapseElement = new Collapse(document.getElementById('collapseUsers'), {toggle: false});
        collapseElement.hide();
    }
    
    const fireToastError = (message) => {
        Swal.fire({
            title: "<h5 style='color:azure; font-size:1.3rem'>Error</h5>",
            text: message,
            color: 'azure',
            icon: 'error',
            background: '#323844',
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 6000
        })
     }
    
    if (user) {
        const isAdmin = role.role
        //console.log(isAdmin)
        return (
            <>
                <li className="nav-item">
                    {!clickedOnSearch ? <Button id='search-link-button' variant='link' onClick={() => setClickedOnSearch(true)}>Search</Button> 
                    : null}
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
                    {clickedOnSearch ?
                        <div className='d-flex justify-content-center'>
                            <form className='form-center ms-auto' id='search-form' onSubmit={handleSubmit(performSearch)}>
                                <Form.Group>
                                    <div className="d-flex flex-row">
                                        <Button id="close-search-button" type="button" title='Close search bar' onClick={() => setClickedAndCloseCollapse(false)}>
                                            <i className="bi-x-lg"></i>
                                        </Button>
                                        <Form.Control
                                            id='search-input'
                                            type='text'
                                            placeholder="Search for users..."
                                            {...register('search_input', { required: true })}
                                        />
                                        <Button id="search-button" type="submit" title='Search' data-bs-toggle="collapse" data-bs-target="#collapseUsers">
                                            <i className="bi-search"></i>
                                        </Button>
                                    </div>
                                </Form.Group>
                            </form>
                        </div>
                    : null}
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

    // Extract role from session
    const [user, role] = useAuth()

    return (
        <>
            <nav id='Nav' className="navbar navbar-expand-lg navbar-dark bg-dark p-3">
                <link href='https://fonts.googleapis.com/css?family=Roboto Mono' rel='stylesheet'></link>
                <Link id='Topic' className="navbar-brand" to="/">Topic</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <div className='container-fluid'>
                        <ul className="navbar-nav ms-auto me-auto">
                            {user ? 
                                <LoggedInLinks 
                                    user={user} 
                                    role={role}
                                /> : <LoggedOutLinks />}
                        </ul>
                    </div>
                </div>
            </nav>
            <div class="collapse" id="collapseUsers">
                <div class="card card-body" id="collapseUsersBody">
                    Some placeholder content for the collapse component. This panel is hidden by default but revealed when the user activates the relevant trigger.
                </div>
            </div>
        </>
    )
}

export default Navbar;