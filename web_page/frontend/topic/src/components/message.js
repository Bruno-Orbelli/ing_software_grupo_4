import React, { useState } from 'react';

export default function Message(props) {

    const title = props.title;
    const content = props.content;
    const author = props.author;
    const likes = props.likes;

    console.log(props);

    const [isLogged, setIsLogged] = useState(false);

    // Handle login
    const handleLogin = () => {
        setIsLogged(true);
    }

    // Handle logout
    const handleLogout = () => {
        setIsLogged(false);
    }

    return (
        <div class="card" style={{"width":"10rem;"}}>
            <div class="card-body">
                <h3 class="card-title">{author}</h3>
                <h5 class="card-title">{title}</h5>
                <p class="card-text">{content}</p>
                <p class="card-text">Likes: {likes}</p>
                <a href="#" class="card-link">Edit</a>
            </div>
        </div>
    )
}