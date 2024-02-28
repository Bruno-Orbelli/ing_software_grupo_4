import { useParams } from "react-router-dom"
import Message from "./message"
import ProfileSearchCard from "./profileSearchCard"
import { Button } from "react-bootstrap"
import Swal from "sweetalert2"

const ProfileTabMenu = (props) => {
    const messages = props.messages
    const followers = props.followers
    const viewer_user_id = props.viewer_user_id

    const user_id = useParams().id

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
    
    return (
        <>
            <ul class="nav nav-tabs" id="profileTabMenu" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="messages-tab" data-bs-toggle="tab" data-bs-target="#message-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Messages</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="followers-tab" data-bs-toggle="tab" data-bs-target="#followers-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Followers</button>
                </li>
            </ul>
            <div class="tab-content" id="tabContent">
                <div class="tab-pane fade show active" id="message-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                    {user_id.toString() === viewer_user_id.toString() ?
                    <div id="new-div">
                        <Button id='login-button' variant="primary" onClick={() => (NewMessage())} className='m-3'>
                            New message
                        </Button>
                    </div> : null
                    }
                    <div id="Messages-div">
                        {messages && messages.map((message, key) =>
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
                </div>
                <div class="tab-pane fade" id="followers-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
                    <div id="followers-div">
                            {followers && followers.map((follower, key) =>
                                <ProfileSearchCard
                                    key={key}
                                    user_id={follower.id}
                                    uname={follower.uname}
                                    fname={follower.fname}
                                    lname={follower.lname}
                                />
                            )}
                        </div>
                    </div>
            </div>
        </>
    )
}

export default ProfileTabMenu;