import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditUser() {

    const navigate = useNavigate();

    const [inputs, setInputs] = useState([]);

    const {id} = useParams();

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        getUser();
    }, []);

    function getUser() {
        axios.get(`http://127.0.0.1:7000/getUser/${id}`).then(function(response) {
            console.log(response.data);
            setInputs(response.data);
        }).catch(err => {
            console.log(err);
        });
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        axios.put(`http://127.0.0.1:7000/updateUser/${id}`, inputs).then(function(response) {
            console.log(response.data);
            navigate('/');
        }).catch(err => {
            console.log(err);
        });
    }

    return (
        <div>
            <div className='container h-100'>
                <div className='row'>
                    <div className='col-2'></div>
                    <div className='col-8'>
                        <h1>Edit user</h1>
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