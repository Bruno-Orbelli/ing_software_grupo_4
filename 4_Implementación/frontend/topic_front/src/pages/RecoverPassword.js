import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'; 
import Swal from 'sweetalert2';
import jwt from 'jsonwebtoken';

const RecoverPassword = () => {
    const navigate = useNavigate();
    
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const jwtSecretKey = process.env.REACT_APP_JWT_SECRET_KEY;
    const mailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
   
    const generateToken = (data) => {
        
        const requestingToken = jwt.sign(
            { uname: data.uname, sub: data.email }, 
            jwtSecretKey, 
            { expiresIn: 120, algorithm: 'HS256' }
        );
        
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'requesting_token': requestingToken })
        }

        fetch('/auth/recovery/send_token', requestOptions)
        .then(response => Promise.all([
            response.json(),
            response.status
        ]))
        .then(data => {
            const status = data[1]
            if ([200, 400].includes(status)) {
                fireToastNeutral("If email and username match, you will receive an email with further instructions to recover your password.")
            } else {
                fireToastError(data[0].message)
            }
        })
        .catch(err => console.log(err))

        reset()
        navigate('/login')
    }

    const fireToastNeutral = (message) => {
        Swal.fire({
            title: "<h5 style='color:azure; font-size:1.5rem'>Data submited</h5>",
            text: message,
            color: 'azure',
            background: '#323844',
            icon: 'info',
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 8000
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
                <div id="recovery-row" className='row'>
                    <div id="recovery-col" className='row'>
                        <hr id="divider"></hr>
                        <h1 id="recovery-title">Forgot your password?</h1>
                        <hr id="divider"></hr>
                    </div>
                    <div id="form-col" className='row'>
                        <h5 id="recovery-desc">Fill the following form with your username and email.</h5>
                        <form id="form">
                            <Form.Group>
                                <Form.Label id="recovery-text">Username</Form.Label>
                                <Form.Control type="uname" {...register("uname", { required: true, maxLength: 25 })}/>
                                {errors.uname?.type === "required" && <p style={{ color: "red" }}><small>Username is required</small></p>}
                                {errors.uname?.type === "maxLength" && <p style={{ color: "red" }}><small>Username is too long</small></p>}
                            </Form.Group>
                            <p></p>
                            <Form.Group>
                                <Form.Label id="recovery-text">Email</Form.Label>
                                <Form.Control type="email" {...register("email", { required: true, maxLength: 80, pattern: mailRegex })}/>
                                {errors.email?.type === "required" && <p style={{ color: "red" }}><small>Email is required</small></p>}
                                {errors.email?.type === "maxLength" && <p style={{ color: "red" }}><small>Email is too long</small></p>}
                                {errors.email?.type === "pattern" && <p style={{ color: "red" }}><small>Invalid email format</small></p>}
                            </Form.Group>
                            <p></p>
                            <Form.Group id="button-group">
                                <Button id="recovery-button" as="sub" variant="primary" onClick={handleSubmit(generateToken)} className='mt-1'>
                                    Recover password
                                </Button>
                            </Form.Group>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default RecoverPassword;