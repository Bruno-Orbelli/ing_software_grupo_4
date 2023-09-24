import React from 'react';

const ProfileCard = (props) => {

    const fname = props.fname;
    const lname = props.lname;
    const uname = props.uname;
    const email = props.email;

    const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')
    const role = JSON.parse(atob(token.split('.')[1])).role

    let roleName = role === true ? 'Admin' : null

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
            </div>
            <hr id='divider'></hr>
        </div>
    )
}

export default ProfileCard;