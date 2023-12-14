import React, { useState } from 'react';
import './CreatePost.css';
import axios from 'axios';

const API_ENDPOINTS = {
    CREATE_POST: '/api/posts/',
};

export default function CreatePost({ username, userId }) {
    const [tweetContentInput, setTweetContentInput] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const isInputValid = () => tweetContentInput.trim() !== '' && userId;

    const handleTweetContentChange = event => {
        setTweetContentInput(event.target.value);
    };

    const handleSubmit = async () => {
        if (!isInputValid()) {
            setErrorMessage('Please enter some text to tweet.');
            return;
        }

        try {
            const response = await axios.post(API_ENDPOINTS.CREATE_POST, {
                userId: userId,
                content: tweetContentInput,
            });

            if (response.status === 200) {
                setTweetContentInput('');
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('Sorry, we could not send your tweet right now. Please try again later.');
        }
    };

    return (
        <div className="post-and-error-container">
            <div className="create-post-container">
                <h1>Share Your Moment!</h1>
                <div className="update-container">
                    <input
                        type='text'
                        value={tweetContentInput}
                        onChange={handleTweetContentChange}
                        className="input-status-update twitter-font"
                        placeholder="What's happening?"
                    />
                    <div className="submit-tweet-button white-text twitter-font" onClick={handleSubmit}>TWEET</div>
                </div>
            </div>
            {errorMessage && <div className="error-message twitter-font">{errorMessage}</div>}
        </div>
    );
}
