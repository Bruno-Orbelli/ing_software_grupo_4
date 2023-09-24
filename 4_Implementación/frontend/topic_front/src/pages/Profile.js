import React, { useEffect, useState } from 'react';
import ProfileCard from '../components/profile';
import Message from '../components/message';
import { useAuth } from '../components/auth';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

const NewMessage = async () => {
    //console.log(message)

    Swal.fire({
        title: "<h5 style='color:azure; font-size:2rem'>New Message</h5>",
        html: `<input type="text" style='color:azure' id="title" class="swal2-input" placeholder="Title">` +
            `<textarea id="content" style='color:azure' class="swal2-textarea" rows="100" cols="33" placeholder="Type your message here..."></textarea>`,
        background: '#282c34',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonColor: '#494996',
        confirmButtonText: 'Submit',
        preConfirm: async () => {
            const title = document.getElementById('title').value;
            const content = document.getElementById('content').value;

            if (!title || !content) {
                Swal.showValidationMessage(`Please, complete all the fields`)
            }
        }
    })
        .then((result) => {

            const title = document.getElementById('title').value;
            const content = document.getElementById('content').value;

            if (result.isConfirmed) {

                const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')

                const body = {
                    title: title,
                    content: content
                }

                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${JSON.parse(token).access_token}`
                    },
                    body: JSON.stringify(body)
                }
                //console.log(requestOptions)
                fetch('/messages/messages', requestOptions)
                    .then(response => Promise.all([
                        response.json(),
                        response.status
                    ]))
                    .then(data => {
                        const message = data[0]
                        const status = data[1]
                        if (status === 201) {
                            //console.log(message)
                            fireToastSuccess(message.message)
                        }
                        else {
                            fireToastError(message.message)
                        }
                    })

            }
        })
}

const fireToastSuccess = (message) => {
    Swal.fire({
        title: "<h5 style='color:azure; font-size:1.3rem'>Message posted!</h5>",
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
        title: "<h5 style='color:azure; font-size:1.3rem'>Error</h5>",
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

const LoggedInLinks = () => {

    const [userData, setData] = useState([]); // Esto es un hook
    const [messages, setMessages] = useState([]); // Esto es un hook

    // Get user data from token
    const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')
    const id = JSON.parse(atob(token.split('.')[1])).user_id

    //const userRef = useRef(undefined);

    const CompareByDate = (a, b) => {
        const dateA = new Date(a.create_at)
        const dateB = new Date(b.create_at)

        return dateB - dateA
    }

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        fetch(`/users/user/${id}`)
            .then(response => Promise.all([
                response.json(),
                response.status
            ]))
            .then(data => {
                const user = data[0]
                const status = data[1]
                if (status === 200) {
                    //console.log(user)
                    setData(user)
                    setMessages(user.messages.sort(CompareByDate))
                    //userRef.current = user
                }
                else {
                    console.log(user)
                }
            })
    }, []
    );

    return (
        <>
            <div id="tab-row-profile" className='row'>
                <ProfileCard
                    fname={userData.fname}
                    lname={userData.lname}
                    uname={userData.uname}
                    email={userData.email}
                    role={userData.role}
                />
            </div>
            <hr></hr>
            <div id="new-div">
                <Button id='login-button' variant="primary" onClick={() => (NewMessage())} className='m-3'>
                    New message
                </Button>
            </div>
            <div id="Messages-div">
                {messages.map((message, key) =>
                    <Message
                        key={key}
                        id={message.id}
                        title={message.title}
                        content={message.content}
                        likes={message.likes}
                        author_id={message.user_id}
                        author_data={message.user_data}
                        create_at={message.create_at}
                    />
                )}
            </div>
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