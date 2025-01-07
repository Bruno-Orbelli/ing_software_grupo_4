import React from 'react';
import { useState, useEffect } from 'react';


const Message = (props) => {

    const title = props.title;
    const content = props.content;
    const author_id = props.author_id;
    const author_data = props.author_data;
    const [likes, setLikes] = useState(props.likes); // Text of the message
    const create_at = props.create_at;
    const original_message_id = props.original_message_id;
    const current_user_id = props.current_user_id;
    console.log(current_user_id)
    console.log(author_id)

    //Change date format
    const date = new Date(create_at);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const create_at_format = day + '/' + month + '/' + year;
    const formatted_hours = hours < 10 ? '0' + hours : hours;
    const formatted_minutes = minutes < 10 ? '0' + minutes : minutes;
    const create_at_time = formatted_hours + ':' + formatted_minutes;

    const getIfLiked = async () => {
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`/likes/likes/${props.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token).access_token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to update the likes');
        }

        const body = await response.json();

        if (body.length === 0) {
            return false;
        } else {
        return true;
        }
        
    };

    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        getIfLiked().then(liked => setIsLiked(liked)).catch(error => console.error(error));
    }, []);

    const fetchUpdatedMessage = async () => {
        const response = await fetch(`/messages/message/${props.id}`);
        if (response.ok) {
            const updatedMessage = await response.json();
            setLikes(updatedMessage.likes);
            setIsLiked(updatedMessage.isLiked); // Esto asume que el servidor devuelve esta información
        }
    };

    const handleLike = async () => {
        const newIsLiked = !isLiked;
        const newLikes = newIsLiked ? likes + 1 : likes - 1;

        // Update the state
        setIsLiked(newIsLiked);
        setLikes(newLikes);

        // Make an API call to update the likes in the database
        // try {
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`/likes/likes/${props.id}`, {
            method: newIsLiked ? 'POST' : 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token).access_token}`
            },
        });
        if (!response.ok) {
            throw new Error('Failed to update the likes');
        }
    };

    const handleRepost = async () => {
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');
        if (!token) {
            throw new Error('No authentication token found');
        }
    
        const response = await fetch(`/messages/message/${props.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token).access_token}`,
            },
        });
    
        if (response.ok) {
            const newMessage = await response.json(); // Obtén el nuevo mensaje
            props.addNewMessage(newMessage); // Actualiza la lista de mensajes en el padre
        } else {
            throw new Error('Failed to repost the message');
        }
    };

    const HandleDelete = async () => {
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`/messages/message/${props.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token).access_token}`,
            },
        });

        if (response.ok) {
            props.deleteMessage(props.id); // Actualiza la lista de mensajes en el padre
        } else {
            throw new Error('Failed to delete the message');
        }
    }

    return (
        <div id='message' className="card m-3">
            <div className='row'>
                <div id='profile-img' className='col-2'>
                </div>
                <div className='col-10'>
                    <div id='message-body' className="card-body">
                        <div className='row'>
                            <div className='col-8'>
                                <h3 id='name-title' className="card-title">{author_data.uname}</h3>
                            </div>
                            <div id='time-col' className='col-4'>
                                <small id='date'>{create_at_format} | {create_at_time}h</small>
                            </div>
                        </div>
                        <div className='row'>
                            <small id='rname'>{author_data.fname.charAt(0).toUpperCase()
                                + author_data.fname.slice(1)} {author_data.lname.charAt(0).toUpperCase() + author_data.lname.slice(1)}</small>
                            <h5 id='message-title' className="card-title">{title}</h5>
                            <p className="card-text">{content}</p>
                            {original_message_id && <small id="rname">Repost from user {props.author_data.uname}</small>}
                            <div className='col-11'>
                                <span>
                                    <span id='stars' onClick={handleLike} style={{ cursor: 'pointer', marginRight: '10px' }}>
                                        {isLiked ? '💜' : '🤍'} {likes}
                                    </span>
                                    <span id='comments' style={{ cursor: 'pointer', marginRight: '10px' }}>💬</span>
                                    <span id='repost' onClick={handleRepost} style={{ cursor: 'pointer' }}>🔄</span>
                                    {current_user_id === author_id && 
                                        <span id='delete' onClick={HandleDelete} style={{ cursor: 'pointer', marginLeft: '10px' }}>🗑️</span>
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Message;