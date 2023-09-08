import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RegisterUser() {

    const navigate = useNavigate(); // Esto es un hook para redirigir a otra página

    const [inputs, setInputs] = useState([]);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post(`http://127.0.0.1:7000/registerUser`, inputs).then(function(response) {
            console.log(response.data); // Se imprime la respuesta (Despues quitar)
            navigate('/'); // Se redirige a la página principal
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
                        <h1>Create user</h1>
                        <form onSubmit={handleSubmit}>
                            <div className='mb-3'>
                                <label>First Name</label>
                                <input type="text" className='form-control' name='fname' onChange={handleChange} />
                            </div>
                            <div className='mb-3'>
                                <label>Last Name</label>
                                <input type="text" className='form-control' name='lname' onChange={handleChange} />
                            </div>
                            <div className='mb-3'>
                                <label>User Name</label>
                                <input type="text" className='form-control' name='uname' onChange={handleChange} />
                            </div>
                            <div className='mb-3'>
                                <label>Email</label>
                                <input type="email" className='form-control' name='email' onChange={handleChange} />
                            </div>
                            <div className='mb-3'>
                                <label>Password</label>
                                <input type="password" className='form-control' name='password1' onChange={handleChange} />
                            </div>
                            <div className='mb-3'>
                                <label>Repeat Password</label>
                                <input type="password" className='form-control' name='password2' onChange={handleChange} /> 
                            </div>
                            <button type="submit" name='add' className='btn btn-primary'>Register</button>
                        </form>
                    </div>
                    <div className='col-2'></div>
                </div>
            </div>
        </div>
    )
}