import React, { useEffect, useState } from 'react';
import Message from '../components/message';
import { useAuth } from '../components/auth';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

const NewMessage = async () => {
  //console.log(message)

  Swal.fire({
    title: 'New Message',
    html: `<input type="text" id="title" class="swal2-input" placeholder="Title">` +
      `<textarea id="content" class="swal2-textarea" rows="100" cols="33" placeholder="Type your message here..."></textarea>`,
    focusConfirm: false,
    showCancelButton: true,
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
            Swal.fire({
              title: 'Message posted!',
              icon: 'success',
              toast: true,
              position: 'bottom-end',
              showConfirmButton: false,
              timer: 3000
            })
          }
          else {
            Swal.fire({
              title: 'Error',
              text: message,
              icon: 'error',
              showConfirmButton: true
            })
          }
        })

      }
    })
}


const LoggedInLinks = () => {

  const [messages, setMessages] = useState([]); // Esto es un hook

  const CompareByDate = (a, b) => {
    const dateA = new Date(a.create_at)
    const dateB = new Date(b.create_at)

    return dateB - dateA
  }

  useEffect(() => {
    /* eslint-disable react-hooks/exhaustive-deps */
    fetch('/messages/messages')
      .then(response => Promise.all([
        response.json(),
        response.status
      ]))
      .then(data => {
        const message = data[0]
        const status = data[1]
        if (status === 200) {
          //console.log(message)
          setMessages(message)
        }
        else {
          console.log(message)
        }
      })
  }, []
  );

  return (
    <>
      <div id="tab-row" className='row'>
        <div id="tendencies-col" className='col-6'>
          <h4>
            Tendencies
          </h4>
        </div>
        <div id="following-col" className='col-6'>
          <h4>
            Following
          </h4>
        </div>
      </div>
      <hr></hr>
      <div id="new-div">
        <Button variant="primary" onClick={() => (NewMessage())} className='m-3'>
          New message
        </Button>
      </div>
      <div id="Messages-div">
        {messages.sort(CompareByDate).map((message, key) =>
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
        <p>Please, log in to see the messages</p>
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

const Home = () => {

  const [logged] = useAuth()

  return (
    <div>
      <hr></hr>
      <h1>Messages</h1>
      <hr></hr>
      <div>
        {logged ? <LoggedInLinks /> : <LoggedOutLinks />}
      </div>
    </div>
  )
}

export default Home