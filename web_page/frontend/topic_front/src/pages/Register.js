import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Register = () => {

    const navigate = useNavigate()
    const { register, watch, handleSubmit, reset, formState: { errors } } = useForm(); // initialize the hook form

    const submitForm = (data) => { // data is an object that contains all the data of the form

        //console.log(data)

        // Create body object, it has the same structure as the backend model
        const body = {
            fname: data.fname,
            lname: data.lname,
            uname: data.uname,
            email: data.email,
            password1: data.password1,
            password2: data.password2
        }

        // Send data to backend
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }
        fetch('/auth/register', requestOptions)
        .then(response => Promise.all([
            response.json(),
            response.status
        ])) // convert to json
        .then(data => {
            const message = data[0].message
            const status = data[1]
            if (status === 201) {
                fireAlert(message)
                navigate('/login')
            }
            else {
                fireToastError(message)
            }
        }) // print data to console
        .catch(err => console.log(err)) // print error to console

        reset() // reset the form after submiting it

    }

    // Fire alert with sweetalert2
    const fireAlert = (message) => {
        Swal.fire({
            title: 'Success!',
            text: message,
            icon: 'success',
            confirmButtonText: 'Ok'
        })
    }

    // Fire Toast error with sweetalert2
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

    // console.log(watch("fname")) // watch input value by passing the name of it

    return (
        <div>
            <div className='container h-100'>
                <div className='row'>
                    <div className='col-2'></div>
                    <div className='col-8'>
                        <hr></hr>
                        <h1>Register</h1>
                        <hr></hr>
                        <form>
                            <Form.Group>
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type="text" {...register("fname", { required: true, maxLength: 50 })} />
                                {errors.fname?.type === "required" && <p style={{ color: "red" }}><small>First name is required</small></p>}
                                {errors.fname?.type === "maxLength" && <p style={{ color: "red" }}><small>First name cannot exceed 50 characters</small></p>}
                            </Form.Group>
                            <p></p>
                            <Form.Group>
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type="text" {...register("lname", { required: true, maxLength: 50 })} />
                                {errors.lname?.type === "required" && <p style={{ color: "red" }}><small>Last name is required</small></p>}
                                {errors.lname?.type === "maxLength" && <p style={{ color: "red" }}><small>Last name cannot exceed 50 characters</small></p>}
                            </Form.Group>
                            <p></p>
                            <Form.Group>
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" {...register("uname", { required: true, maxLength: 25 })} />
                                {errors.uname?.type === "required" && <p style={{ color: "red" }}><small>Username is required</small></p>}
                                {errors.uname?.type === "maxLength" && <p style={{ color: "red" }}><small>Username cannot exceed 25 characters</small></p>}
                            </Form.Group>
                            <p></p>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" {...register("email", { required: true, maxLength: 80 })} />
                                {errors.email?.type === "required" && <p style={{ color: "red" }}><small>Email is required</small></p>}
                                {errors.email?.type === "maxLength" && <p style={{ color: "red" }}><small>Email cannot exceed 80 characters</small></p>}
                            </Form.Group>
                            <p></p>
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" {...register("password1", { required: true, minLength: 8 })} />
                                {errors.password1?.type === "required" && <p style={{ color: "red" }}><small>Password is required</small></p>}
                                {errors.password1?.type === "minLength" && <p style={{ color: "red" }}><small>Password must be at least 8 characters</small></p>}
                            </Form.Group>
                            <p></p>
                            <Form.Group>
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control type="password" {...register("password2", { required: true, minLength: 8, validate: value => value === watch("password1") || "Passwords do not match" })} />
                                {errors.password2?.type === "required" && <p style={{ color: "red" }}><small>Confirm password is required</small></p>}
                                {errors.password2?.type === "minLength" && <p style={{ color: "red" }}><small>Confirm password must be at least 8 characters</small></p>}
                                {errors.password2?.type === "validate" && <p style={{ color: "red" }}><small>Passwords do not match</small></p>}
                            </Form.Group>
                            <Form.Group>
                                <Button as="sub" variant="primary" onClick={handleSubmit(submitForm)} className='mt-3'>
                                    Register
                                </Button>
                            </Form.Group>
                        </form>
                    </div>
                    <div className='col-2'></div>
                </div>
            </div>
        </div>
    )
}

export default Register