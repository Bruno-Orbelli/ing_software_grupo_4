import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useAuth, logout } from './auth';
import { useState, useRef, useEffect } from 'react';
import ProfileSearchCard from './profileSearchCard';
import Swal from 'sweetalert2';

const LoggedInLinks = ({ user, role, users, setUsers, collapseRef }) => {
    
    const [clickedOnSearch, setClickedOnSearch] = useState(false)

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')
    const viewer_user_id = JSON.parse(atob(token.split('.')[1])).user_id
    
    useEffect(() => {
        window.addEventListener("beforeunload", eraseSearches);
    })

    const performSearch = (data) => {
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
                const add = Object.keys(body).length === 0 ? [] : body
                setUsers(add)
            }
            else {
                fireToastError(body)
            }
        })

        if (users.length > 0) {
            collapseRef.current.classList.add('show')
        }
    }
    
    const unsetClickedAndCloseCollapse = () => {
        setClickedOnSearch(false);
    
        // Hide the collapse if it's open
        if (collapseRef.current !== null && collapseRef.current.classList.contains('show')) {
            collapseRef.current.classList.remove('show');
        }
      };
    
    const eraseSearches = () => {
        setUsers([])
        reset()
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
                                <li><Link className="dropdown-item" to={"/user/" + viewer_user_id}>Profile</Link></li>
                                <li><Link className="dropdown-item" to="/login" onClick={() => { logout() }}>Log out</Link></li>
                            </ul>
                        </li>
                    </ul>
                    {clickedOnSearch ?
                        <div className='d-flex justify-content-center'>
                            <form className='form-center ms-auto' id='search-form' onSubmit={handleSubmit(performSearch)}>
                                <Form.Group>
                                    <div className="d-flex flex-row">
                                        <Button id="close-search-button" type="button" title='Close search bar' onClick={() => unsetClickedAndCloseCollapse()}>
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

    const [users, setUsers] = useState([]);

    const collapseRef = useRef(null);
    
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
                                    users={users}
                                    setUsers={setUsers}
                                    collapseRef={collapseRef}
                                /> : <LoggedOutLinks />}
                        </ul>
                    </div>
                </div>
            </nav>
            {users.length != 0 &&
            <div className="collapse" id="collapseUsers" ref={collapseRef}>
                <div className="card card-body" id="collapseUsersBody">
                    <ul className="list-group">
                        {users.map((user, key) => 
                            <ProfileSearchCard
                                key={key}
                                user_id={user.id}
                                uname={user.uname}
                                fname={user.fname}
                                lname={user.lname}
                            />
                        )}
                    </ul>
                </div>
            </div>
            }
        </>
    )
}

export default Navbar;