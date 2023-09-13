import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../components/auth";
import NotFound from "./NotFound";
import Swal from "sweetalert2";

const ShowEditUser = () => {

    const navigate = useNavigate();

    const [inputs, setInputs] = useState([]);

    const {id} = useParams();

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        getUser();
    }, []);

    const getUser = () => {
        fetch(`/users/user/${id}`)
        .then(response => Promise.all([
            response.json(),
            response.status
        ]))
        .then(data => {
            const user = data[0]
            const status = data[1]
            if (status === 200) {
                //console.log(user)
                setInputs(user)
            }
            else {
                console.log(user)
            }
        })
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY') 
        
        fetch (`/users/user/${id}`, {
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
                navigate('/users');
                Swal.fire({
                    icon: 'success',
                    title: `User ${message.uname} edited successfully`,
                    toast: true,
                    position: 'bottom-end',
                    showConfirmButton: false,
                    timer: 3000
                })
            }
            else {
                console.log(message)
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: message.message,
                    showConfirmButton: true
                })
            }
        }
        )
    }

    return (
        <div>
            <div className='container h-100'>
                <div className='row'>
                    <div className='col-2'></div>
                    <div className='col-8'>
                        <hr></hr>
                        <h1>Edit user</h1>
                        <hr></hr>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label>First Name</label>
                                <input type="text" value={inputs.fname} className="form-control" name="fname" onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label>Last Name</label>
                                <input type="text" value={inputs.lname} className="form-control" name="lname" onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label>User Name</label>
                                <input type="text" value={inputs.uname} className="form-control" name="uname" onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label>Email</label>
                                <input type="email" value={inputs.email} className="form-control" name="email" onChange={handleChange} />
                            </div>
                            <button type="submit" name="update" className="btn btn-primary">Edit</button>
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
        const isAdmin = role.role;
        return (
            <>
                {isAdmin ? <ShowEditUser /> : <NotFound />}
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