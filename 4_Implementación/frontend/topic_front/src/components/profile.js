import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProfileCard = (props) => {
    
    const fname = props.fname;
    const lname = props.lname;
    const uname = props.uname;
    const email = props.email;

    const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')
    const role = JSON.parse(atob(token.split('.')[1])).role
    const user_id = useParams().id
    const viewer_user_id = JSON.parse(atob(token.split('.')[1])).user_id.toString()

    const [isViewer, setIsViewer] = useState(undefined)
    const [isFollowed, setIsFollowed] = useState(undefined)
    const navigate = useNavigate()

    let roleName = role === true ? 'Admin' : null

    // Check if user === viewer and if is already followed
    useEffect(() => {
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token).access_token}`
            }
        }
        
        fetch(`/followships/followships?` + new URLSearchParams({ "follower_id": viewer_user_id, "followed_id": user_id }), requestOptions)
        .then(response => Promise.all([
            response.json(),
            response.status
        ]))
        .then(data => {
            const body = data[0]
            const status = data[1]
            if (status === 200) {
                setIsFollowed(body.length > 0 || (user_id.toString() === viewer_user_id.toString()))
            }
        })

        setIsViewer(viewer_user_id === user_id)
        console.log(viewer_user_id, user_id, isViewer, isFollowed)

    });

    const followUser = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${JSON.parse(token).access_token}` },
            body: JSON.stringify({ "followed_id": user_id })
        }

        //console.log(followUser)

        fetch('/followships/followships', requestOptions)
        .then(response => Promise.all([
            response.json(),
            response.status
        ]))
        .then(data => {
            const message = data[0]
            const status = data[1]
            if (status === 201) {
                fireToastSuccess("You have successfully followed " + uname + ".")
                setIsFollowed(true)
            }
            else {
                fireToastError(message.message)
            }
        })
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
        <div id='profile-card' className="card m-3">
            <hr id='divider'></hr>
            <div id="profile-body" className="card-body">
                <div id="presentation-row" className='row'>
                    <div id='profile-image' className='col-3'>
                    </div>
                    <div className='col-9'>
                        <h3 className="card-title">{fname} {lname}</h3>
                        <h5 className="card-title">{uname}</h5>
                        <p className="card-text">{email}</p>
                        <p id='role' className="card-text">{roleName}</p>
                    </div>
                </div>
                <div id="buttons-row" className='row'>
                    {!isFollowed ? <div className='col-3'>
                        <button id="btn-follow-2" className="btn btn-primary" onClick={() => followUser()}>Follow</button>
                    </div> : (user_id !== viewer_user_id ?
                        <div className='col-3'>
                            <p id="already-followed-text-2">
                                <i className="bi bi-check-lg"> Following</i>
                            </p>
                        </div> : null)
                    }
                    {user_id && isViewer ? <div className='col-3'>
                        <button id="btn-edit" className="btn btn-warning" onClick={() => navigate("/edit/" + user_id)}>Edit</button>
                    </div> :
                    null
                    }
                </div>
            </div>
            <hr id='divider'></hr>
        </div>
    )
}

export default ProfileCard;