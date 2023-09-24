import React, { useEffect, useState } from 'react';
//import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/auth';
import NotFound from './NotFound';
import Swal from 'sweetalert2';

const ShowABM = () => {

    const [users, setUsers] = useState([]); // Esto es un hook

    useEffect(() => {
        GetUsers();
    }, []);

    const GetUsers = () => {
        fetch('/users/users')
            .then(response => Promise.all([
                response.json(),
                response.status
            ]))
            .then(data => {
                const users = data[0]
                const status = data[1]
                if (status === 200) {
                    //console.log(users)
                    setUsers(users)
                }
                else {
                    console.log(users)
                }
            })
    }

    const DeleteUser = (id) => {

        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')

        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this user!',
            icon: 'warning',
            showCancelButton: true,
            iconColor: '#ebbe57',
            background: '#323844',
            color: 'azure',
            confirmButtonText: 'Yes, delete it!',
            confirmButtonColor: '#bb1849',
            cancelButtonText: 'No, keep it!',
            cancelButtonColor: '#494996',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`/users/user/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${JSON.parse(token).access_token}`
                    }
                }).then(response => Promise.all([
                    response.json(),
                    response.status
                ]))
                    .then(data => {
                        const message = data[0]
                        const status = data[1]
                        if (status === 200) {
                            //console.log(message)
                            fireToastSuccess(message.message)
                            GetUsers();
                        }
                        else {
                            fireToastError(message.message)
                        }
                    })
            }
        })
    }

    const fireToastSuccess = (message) => {
        Swal.fire({
            title: "<h5 style='color:azure; font-size:1.5rem'>User deleted successfully</h5>",
            text: message,
            color: 'azure',
            background: '#323844',
            icon: 'success',
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000
        })
    }

    const fireToastError = (message) => {
        Swal.fire({
            title: "<h5 style='color:azure; font-size:1.5rem'>Error</h5>",
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

    return (
        <div>
            <div className='container h-100'>
                <div className='row h-100'>
                        <hr id='divider'></hr>
                    <div id='ABM-title-col' className='col-12'>
                        <h1 id='Messages'>Users ABM</h1>
                    </div>
                        <hr id='divider'></hr>
                    <div className='col-12'>
                        <table id='abm-table' className='table table-bordered table-striped'>
                            <thead id='abm-header'>
                                <tr id='table-header'>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>User Name</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id='table-body'>
                                {users.map((user, key) =>
                                    <tr key={key}>
                                        <td>{user.id}</td>
                                        <td>{user.fname + ' ' + user.lname}</td>
                                        <td>{user.uname}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <Link id='edit-button' to={`user/${user.id}/edit`} className='btn btn-success' style={{ marginRight: "10px" }}>Edit</Link>
                                            <button id='delete-button' onClick={() => DeleteUser(user.id)} className='btn btn-danger'>Delete</button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

const LoggedInLinks = () => {

    const [user, role] = useAuth();

    if (user) {
        const isAdmin = role.role;
        return (
            <>
                {isAdmin ? <ShowABM /> : <NotFound />}
            </>
        )
    }

}

const ShowUsers = () => {

    const [logged] = useAuth()

    return (
        <>
            {logged ? <LoggedInLinks /> : <NotFound />}
        </>
    )

}

export default ShowUsers