import React, { useEffect, useState } from 'react';
import ProfileCard from '../components/profile';
import ProfileTabMenu from '../components/profileTabMenu';
import { useAuth } from '../components/auth';
import { Link, useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const LoggedInLinks = () => {

    const [userData, setData] = useState(undefined); // Esto es un hook
    const [messages, setMessages] = useState(undefined); // Esto es un hook
    const [followers, setFollowers] = useState(undefined);

    // Get user data from token
    const tokenJson = localStorage.getItem('REACT_TOKEN_AUTH_KEY')
    const token = JSON.parse(tokenJson).access_token
    const id = useParams().id
    const viewer_user_id = JSON.parse(atob(token.split('.')[1])).user_id

    //const userRef = useRef(undefined);

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        fetch(`/users/user/${id}`, requestOptions)
            .then(response => Promise.all([
                response.json(),
                response.status
            ]))
            .then(data => {
                console.log(data)
                const user = data[0]
                const status = data[1]
                if (status === 200) {
                    console.log(user.id)
                    setData(user)
                    setMessages(user.messages.sort(CompareByDate))
                    setFollowers(user.followers)
                    //userRef.current = user
                }
            })
        }, []
    );

    const CompareByDate = (a, b) => {
        const dateA = new Date(a.create_at)
        const dateB = new Date(b.create_at)

        return dateB - dateA
    }

    return (
        <>
            <div id="tab-row-profile" className='row'>
                <ProfileCard
                    user_id={userData && id}
                    fname={userData && userData.fname.charAt(0).toUpperCase()
                        + userData.fname.slice(1)}
                    lname={userData && userData.lname.charAt(0).toUpperCase()
                        + userData.lname.slice(1)}
                    uname={userData && userData.uname}
                    email={userData && userData.email}
                    role={userData && userData.role}
                />
            </div>
            <hr></hr>
            <ProfileTabMenu
                messages={messages}
                followers={followers}
                viewer_user_id={viewer_user_id}
            />
        </>
    )
}

const LoggedOutLinks = () => {
    return (
        <>
            <div>
                <h2>Welcome to Topic!</h2>
                <p>Please, log in to see your profile</p>
                <div>
                    <Button variant="primary" href='/login' className='mt-1'>
                        Login
                    </Button>
                </div>
                <div className='mt-3'>
                    <small>
                        Do not have an account?
                        <Link className='m-2' to="/register">
                            Create account
                        </Link>
                    </small>
                </div>
            </div >
        </>
    )
}

const Profile = () => {

    const [logged] = useAuth()

    return (
        <div>
            <div>
                {logged ? <LoggedInLinks /> : <LoggedOutLinks />}
            </div>
        </div>
    )
}

export default Profile