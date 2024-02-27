import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const ProfileSearchCard = (props) => {

    const [followed, setFollowed] = useState(false)
    
    const uname = props.uname
    const fname = props.fname.charAt(0).toUpperCase() + props.fname.slice(1)
    const lname = props.lname.charAt(0).toUpperCase() + props.lname.slice(1)
    const user_id = props.user_id

    const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')
    const viewer_role = JSON.parse(atob(token.split('.')[1])).role
    const viewer_user_id = JSON.parse(atob(token.split('.')[1])).user_id

    let roleName = viewer_role === true ? 'Admin' : null

    // Check if a user has already been followed and set state accordingly    
    useEffect(() => {
        const requestOptions = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(token).access_token}`
          },
        };
      
        fetch(`/followships/followships?` + new URLSearchParams({"follower_id": viewer_user_id}), requestOptions)
          .then(response => Promise.all([
            response.json(),
            response.status
          ]))
          .then(data => {
            const body = data[0];
            const status = data[1];
            if (status === 200) {
              if (body.some(followship => followship.followed_id === user_id)) {
                setFollowed(true);
              }
            } else {
              fireToastError(body);
            }
          })
      }, []);
    
    const followUser = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${JSON.parse(token).access_token}` },
            body: JSON.stringify({ "followed_id": user_id })
        }

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
                setFollowed(true)
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
        <li id="search-list-item" class="list-group-item">
            <div id='profile-search-card' className="card">
                <div id="profile-search-body" className="card-body">
                    <div id="presentation-search-row" className='row-12'>
                        <div id="profile-search-image" class="col-1"></div>
                        <div className='col-6'>
                            <h5 className="card-title">{uname}</h5>
                            <p className="card-text">{fname} {lname}</p>
                            <p id='role' className="card-text">{roleName}</p>
                        </div>
                        {!followed && 
                        <div className='col-6 align-end'>
                            <button id="btn-follow" className="btn btn-primary" onClick={() => followUser()}>Follow</button>
                        </div> }
                    </div>
                </div>
            </div>
        </li>
    )
}

export default ProfileSearchCard;