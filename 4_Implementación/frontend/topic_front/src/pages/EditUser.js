import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../components/auth";
import NotFound from "./NotFound";
import Swal from "sweetalert2";

const ShowEditUser = () => {

    const navigate = useNavigate();

    const [inputs, setInputs] = useState([]);

    const { id } = useParams();

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        getUser();
    }, []);

    const getUser = () => {
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')
    
        const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(token).access_token}`
            }
        }

        if (id !== JSON.parse(atob(JSON.parse(token).access_token.split('.')[1])).user_id.toString()) {
            console.log(id, JSON.parse(atob(JSON.parse(token).access_token.split('.')[1])).user_id)
            navigate('/');
        }
        
        fetch(`/users/user/${id}`, requestOptions)
            .then(response => Promise.all([
                response.json(),
                response.status
            ]))
            .then(data => {
                const user = data[0]
                const status = data[1]
                if (status === 200) {
                    delete user.followers
                    delete user.messages
                    delete user.following
                    setInputs(user)
                }
                else {
                    console.log(user)
                }
            }
        )
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')

        // Check if inputs are empty
        if (inputs.fname === '' || inputs.lname === '' || inputs.uname === '' || inputs.email === '') {
            fireToastError('Please fill all of the fields.')
            return
        }

        fetch(`/users/user/${id}`, {
            method: 'PUT',
            body: JSON.stringify(inputs),
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
                    navigate('/');
                    fireToastSuccess(message.uname)
                }
                else {
                    fireToastError(message.message)
                }
            }
            )
    }

    const fireToastSuccess = (message) => {
        Swal.fire({
            title: "<h5 style='color:azure; font-size:1.3rem'>User " + message + " edited successfully</h5>",
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
            title: "<h5 style='color:azure; font-size:1.3rem'>Error</h5>",
            text: message,
            icon: 'error',
            color: 'azure',
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
                <div id='login-row' className='row'>
                    <div id='edit-col' className='row'>
                        <hr id='divider'></hr>
                        <h1 id='login-title'>Edit user</h1>
                        <hr id='divider'></hr>
                    </div>
                    <div id="form-col" className='row'>
                        <form id='edit-form' onSubmit={handleSubmit}>
                            <div className="col-12">
                                <div className="mb-3">
                                    <label id="login-text">First Name</label>
                                    <input type="text" value={inputs.fname && (inputs.fname.charAt(0).toUpperCase() + inputs.fname.substring(1))} className="form-control" name="fname" onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label id="login-text">Last Name</label>
                                    <input type="text" value={inputs.lname && (inputs.lname.charAt(0).toUpperCase() + inputs.lname.substring(1))} className="form-control" name="lname" onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label id="login-text">User Name</label>
                                    <input type="text" value={inputs.uname && inputs.uname} className="form-control" name="uname" onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label id="login-text">Email</label>
                                    <input type="email" value={inputs.email && inputs.email} className="form-control" name="email" onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label id="login-text">Password</label>
                                    <input type="password" placeholder="Set new password (leave empty to keep current password)" className="form-control" name="password" onChange={handleChange} />
                                </div>
                            </div>
                            <div id='button-col' className="col-12">
                                <button id='edit-form-button' type="submit" name="update" className="btn btn-primary">Edit</button>
                            </div>
                        </form>
                    </div>
                    <div className='col-2'></div>
                </div>
            </div>
        </div>
    )
}

const LoggedInLinks = () => {

    const [user, role] = useAuth();

    if (user) {
        return (
            <>
                {<ShowEditUser />}
            </>
        )
    }

}

const EditUser = () => {

    const [logged] = useAuth()

    return (
        <>
            {logged ? <LoggedInLinks /> : <NotFound />}
        </>
    )

}

export default EditUser