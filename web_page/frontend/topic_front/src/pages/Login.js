import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const loginUser = () => {
        //console.log('Form submitted')

        // Reset form when submitted
        setEmail('')
        setPassword('')
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
                                <Form.Control type="email" name="email" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" name="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
                            </Form.Group>
                            <Form.Group>
                                <Button as="sub" variant="primary" onClick={loginUser} className='mt-3'>
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
                        </form>
                    </div>
                    <div className='col-2'></div>
                </div>
            </div>
        </div>
    )
}

export default Login