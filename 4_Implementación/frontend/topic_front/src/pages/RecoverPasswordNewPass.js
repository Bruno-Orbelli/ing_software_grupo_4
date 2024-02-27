import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import jwt from 'jsonwebtoken';

const RecoverPasswordNewPass = () => {
    const navigate = useNavigate();
    
    const { register, watch, handleSubmit, reset, formState: { errors } } = useForm();

    const [isValid, setValid] = useState(undefined)
    const [mail, setMail] = useState(undefined)
   
    const changePassword = (data) => {
        const token = localStorage.getItem('recovery_token')
        const body = {
            password: data.password1
        }
        
        const userId = jwt.decode(JSON.parse(token), { complete: true }).payload.user_id
        
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token.substring(1, token.length - 1)}` },
            body: JSON.stringify(body)
        }

        fetch(`/users/user/${userId}`, requestOptions)
        .then(response => Promise.all([
            response.json(),
            response.status
        ]))
        .then(data => {
            const status = data[1]
            if (status === 200) {
                fireToastSuccess("Password has been correctly updated. You can now login with your new password.")
                // TODO: Blacklist token
                localStorage.removeItem('recovery_token')
                navigate('/login')
            } else {
                fireToastError(data[0].message)
            }
            reset()
        })
        .catch(err => console.log(err))
    }
    
    const checkIfValidToken = (token) => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }

        fetch(`/auth/recovery/${token}`, requestOptions)
        .then(response => Promise.all([
            response.json(),
            response.status
        ]))
        .then(data => {
            const body = data[0]
            const status = data[1]
            if (status === 200) {
                setValid(body.is_valid)
            } else {
                fireToastError(body.message)
                setValid(false)
            }
        })
        .catch(err => console.log(err))
    }
    
    useEffect(() => {
        const token = window.location.pathname.split('/')[3]
        checkIfValidToken(token)

        if (isValid !== undefined && !isValid) {
            navigate('/')
            return
        } else if (isValid !== undefined && isValid) {
            localStorage.setItem('recovery_token', JSON.stringify(token))
        }
        setMail(jwt.decode(token).sub)
    });
    
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
            timer: 7000
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
                        <h1 id="recovery-title">Set new password</h1>
                        <hr id="divider"></hr>
                    </div>
                    <div id="form-col" className='row'>
                        <h5 id="recovery-desc">Set a new password for {mail}.</h5>
                        <form id="form-new-pass">
                            <Form.Group>
                                <Form.Label id='login-text'>New password</Form.Label>
                                <Form.Control type="password" {...register("password1", { required: true, minLength: 8 })} />
                                {errors.password1?.type === "required" && <p style={{ color: "red" }}><small>Password is required</small></p>}
                                {errors.password1?.type === "minLength" && <p style={{ color: "red" }}><small>Password must be at least 8 characters</small></p>}
                            </Form.Group>
                            <p></p>
                            <Form.Group>
                                <Form.Label id='login-text'>Confirm new password</Form.Label>
                                <Form.Control type="password" {...register("password2", { required: true, validate: value => value === watch("password1") || "Passwords do not match" })} />
                                {errors.password2?.type === "required" && <p style={{ color: "red" }}><small>Confirm password is required</small></p>}
                                {errors.password2?.type === "validate" && <p style={{ color: "red" }}><small>Passwords do not match</small></p>}
                            </Form.Group>
                            <Form.Group id='button-group-new-pass'>
                                <Button id='recovery-button-new-pass' as="sub" variant="primary" onClick={handleSubmit(changePassword)} className='mt-3'>
                                    Change password
                                </Button>
                            </Form.Group>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default RecoverPasswordNewPass;