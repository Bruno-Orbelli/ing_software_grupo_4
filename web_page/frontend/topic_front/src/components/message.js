import React from 'react';
import { Link } from 'react-router-dom';

export default function Message(props) {

    const title = props.title;
    const content = props.content;
    const author = props.author;
    const likes = props.likes;

    return (
        <div class="card" style={{"width":"10rem;"}}>
            <div class="card-body">
                <h3 class="card-title">{author}</h3>
                <h5 class="card-title">{title}</h5>
                <p class="card-text">{content}</p>
                <p class="card-text">Likes: {likes}</p>
                <Link to="#" class="card-link">Edit</Link>
            </div>
        </div>
    )
}