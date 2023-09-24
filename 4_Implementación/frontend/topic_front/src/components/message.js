import React from 'react';

const Message = (props) => {

    const title = props.title;
    const content = props.content;
    const author_data = props.author_data;
    const likes = props.likes;
    const create_at = props.create_at;

    //Change date format
    const date = new Date(create_at);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const create_at_format = day + '/' + month + '/' + year;
    const create_at_time = hours;

    return (
        <div id='message' className="card m-3">
            <div className='row'>
                <div id='profile-img' className='col-2'>
                </div>
                <div className='col-10'>
                    <div id='message-body' className="card-body">
                        <div className='row'>
                            <div className='col-9'>
                                <h3 id='name-title' className="card-title">{author_data.uname}</h3>
                            </div>
                            <div id='time-col' className='col-3'>
                                <small id='date'>{create_at_format} | {create_at_time}h</small>
                            </div>
                        </div>
                        <div className='row'>
                            <small id='rname'>{author_data.fname} {author_data.lname}</small>
                            <h5 id='message-title' className="card-title">{title}</h5>
                            <p className="card-text">{content}</p>
                            <p id='stars' className="card-text">💜 {likes}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Message;