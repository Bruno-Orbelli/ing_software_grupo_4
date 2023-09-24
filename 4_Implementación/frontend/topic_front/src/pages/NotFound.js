import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {

    const navigate = useNavigate()

    return (
        <div id='not-row' className='row'>
            <div id='notfoundimage'></div>
            <p></p>
            <Button id='go-home' variant="primary" onClick={() => { navigate('/') }}>Go Home</Button>
        </div>
    )
}

export default NotFound