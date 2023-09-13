import React from 'react';

const Message = (props) => {

    const title = props.title;
    const content = props.content;
    const author_data = props.author_data;
    const likes = props.likes;

    return (
        <div id='message' className="card m-3">
            <div className="card-body">
                <h3 className="card-title">{author_data.uname}</h3>
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{content}</p>
                <p className="card-text">Likes: {likes}</p>
            </div>
        </div>
    )
}

export default Message;