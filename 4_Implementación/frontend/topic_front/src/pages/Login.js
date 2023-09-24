import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'; 
import { login } from '../components/auth';
import Swal from 'sweetalert2';

const Login = () => {

    const navigate = useNavigate()

    const { register, handleSubmit, reset, formState: { errors } } = useForm(); 

    const loginUser = async (data) => {
        //console.log(data)

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
        
        fetch('/auth/login', requestOptions)
        .then(response => Promise.all([
            response.json(),
            response.status
        ]))
        .then(data => {
            
            const message = data[0].message
            const access_token = data[0].access_token
            const refresh_token = data[0].refresh_token
            const status = data[1]
            
            if (status === 200) {

                const role = JSON.parse(atob(access_token.split('.')[1])).role

                const session = {
                    access_token: access_token,
                    refresh_token: refresh_token,
                    role: role
                }

                fireToastSuccess(message)
                //console.log(access_token)
                //console.log(refresh_token)

                login(session)
                navigate('/')
            }
            else {
                // console.log(message)
                // console.log(status)
                fireToastError(message)
            }

        })
        .catch(err => console.log(err))

        reset()
    }

    const fireToastSuccess = (message) => {
        Swal.fire({
            title: "<h5 style='color:azure; font-size:1.5rem'>Success!</h5>",
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
                <div id="login-row" className='row'>
                    <div id="login-col" className='row'>
                        <hr id="divider"></hr>
                        <h1 id="login-title">Login</h1>
                        <hr id="divider"></hr>
                    </div>
                    <div id="form-col" className='row'>
                        <form id="form">
                            <Form.Group>
                                <Form.Label id="login-text">Email</Form.Label>
                                <Form.Control type="email" {...register("email", { required: true, maxLength: 80 })}/>
                                {errors.email?.type === "required" && <p style={{ color: "red" }}><small>Email is required</small></p>}
                                {errors.email?.type === "maxLength" && <p style={{ color: "red" }}><small>Email is too long</small></p>}
                            </Form.Group>
                            <p></p>
                            <Form.Group>
                                <Form.Label id="login-text">Password</Form.Label>
                                <Form.Control type="password" {...register("password", { required: true, minLength: 8 })}/>
                                {errors.password?.type === "required" && <p style={{ color: "red" }}><small>Password is required</small></p>}
                                {errors.password?.type === "minLength" && <p style={{ color: "red" }}><small>Password is too short</small></p>}
                            </Form.Group>
                            <p></p>
                            <Form.Group id="button-group">
                                <Button id="login-button" as="sub" variant="primary" onClick={handleSubmit(loginUser)} className='mt-1'>
                                    Login
                                </Button>
                            </Form.Group>
                            <Form.Group className='mt-3'>
                                <small id="login-text-2">
                                    Do not have an account?
                                    <Link id="create-account" className='m-2' to="/register">
                                        Create account
                                    </Link>
                                </small>
                            </Form.Group>
                            <Form.Group className='mt-2'>
                                <small id="login-text-2">
                                    Forgot your password?
                                    <Link id="create-account" className='m-2' to="#">
                                        Reset password
                                    </Link>
                                </small>
                            </Form.Group>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login