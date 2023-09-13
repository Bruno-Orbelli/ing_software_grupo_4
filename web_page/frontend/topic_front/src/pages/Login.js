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
            title: 'Success!',
            text: message,
            icon: 'success',
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000
        })
    }

    const fireToastError = (message) => {
        Swal.fire({
            title: 'Error!',
            text: message,
            icon: 'error',
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 6000
        })
    }

    return (
        <div>
            <div className='container h-100'>
                <div className='row'>
                    <div className='col-2'></div>
                    <div className='col-8'>
                        <hr></hr>
                        <h1>Login</h1>
                        <hr></hr>
                        <form>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" {...register("email", { required: true, maxLength: 80 })}/>
                                {errors.email?.type === "required" && <p style={{ color: "red" }}><small>Email is required</small></p>}
                                {errors.email?.type === "maxLength" && <p style={{ color: "red" }}><small>Email is too long</small></p>}
                            </Form.Group>
                            <p></p>
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" {...register("password", { required: true, minLength: 8 })}/>
                                {errors.password?.type === "required" && <p style={{ color: "red" }}><small>Password is required</small></p>}
                                {errors.password?.type === "minLength" && <p style={{ color: "red" }}><small>Password is too short</small></p>}
                            </Form.Group>
                            <p></p>
                            <Form.Group>
                                <Button as="sub" variant="primary" onClick={handleSubmit(loginUser)} className='mt-1'>
                                    Login
                                </Button>
                            </Form.Group>
                            <Form.Group className='mt-3'>
                                <small>
                                    Do not have an account?
                                    <Link className='m-2' to="/register">
                                        Create account
                                    </Link>
                                </small>
                            </Form.Group>
                            <Form.Group className='mt-2'>
                                <small>
                                    Forgot your password?
                                    <Link className='m-2' to="#">
                                        Reset password
                                    </Link>
                                </small>
                            </Form.Group>
                        </form>
                    </div>
                    <div className='col-2'></div>
                </div>
            </div>
        </div>
    )
}

export default Login