import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginUser = () => {

    const navigate = useNavigate(); // Esto es un hook para redirigir a otra página

    const [inputs, setInputs] = useState([]);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post(`/auth/login`, inputs).then(function(response) {
            // Check if response.data is True or False
            console.log(response.data);
            if (response.data['success'] === false) {
                alert('Incorrect username or password');
                return;
            }
            // If response.data is True, then login
            else if (response.data['success'] === true) {
                alert('Successfully logged in');
                // Save login cookie 
                document.cookie = "login=true; path=/"; // Ver de hacerlo con JWT después
                // Redirect to home page
                navigate('/'); // Se redirige a la página principal
            }
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
                        <h1>Login</h1>
                        <form onSubmit={handleSubmit}>
                            <div className='mb-3'>
                                <label>Email</label>
                                <input type="email" className='form-control' name='email' onChange={handleChange} />
                            </div>
                            <div className='mb-3'>
                                <label>Password</label>
                                <input type="password" className='form-control' name='password' onChange={handleChange} />
                            </div>
                            <button type="submit" name='add' className='btn btn-primary'>Login</button>
                        </form>
                    </div>
                    <div className='col-2'></div>
                    <a href="/register">Register</a>
                </div>
            </div>
        </div>
    )
}

export default LoginUser