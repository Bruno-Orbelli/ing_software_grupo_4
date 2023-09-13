import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {

    const navigate = useNavigate()

    return (
        <div>
            <hr></hr>
            <h1>404 Not Found</h1>
            <hr></hr>
            <h3>Page not found</h3>
            <hr></hr>
            <Button variant="primary" onClick={() => { navigate('/') }}>Go Home</Button>
        </div>
    )
}

export default NotFound