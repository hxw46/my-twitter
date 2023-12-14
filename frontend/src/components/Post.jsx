import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./Post.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons'

const API_ENDPOINTS = {
    GET_LOGGED_IN_USER: '/api/users/loggedinuser',
    GET_USER: '/api/users/',
    UPDATE_POST: '/api/posts/',
    DELETE_POST: '/api/posts/',
};

export default function Post({ postDetails }) {
    const [postUsername, setPostUsername] = useState("");
    const [content, setContent] = useState("");
    const [editing, setEditing] = useState(false);
    const [postContentInput, setPostContentInput] = useState("");

    const [loggedInUsername, setLoggedInUsername] = useState("");
    const [loggedInUserId, setLoggedInUserId] = useState("");
    const [isPostOwner, setIsPostOwner] = useState(false);

    useEffect(() => {
        fetchLoggedInUser();
        if (postDetails) {
            fetchPostUsername();
            setContent(postDetails.content);
            setPostContentInput(postDetails.content);
            setIsPostOwner(postDetails.userId === loggedInUserId);
        }
    }, [postDetails, loggedInUserId]);

    const fetchLoggedInUser = async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.GET_LOGGED_IN_USER);
            setLoggedInUsername(response.data.username);
            setLoggedInUserId(response.data.userId);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPostUsername = async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.GET_USER + postDetails.userId);
            setPostUsername(response.data.username);
        } catch (error) {
            console.error(error);
        }
    };

    const navigate = useNavigate();
    const goToUserPage = () => {
        navigate("/profile/" + postDetails.userId, { state: { userId: postDetails.userId } });
    };

    const handlePostContentChange = event => setPostContentInput(event.target.value);

    const handleEditPostClick = () => setEditing(true);

    const submit = async () => {
        if (!postContentInput) return;

        try {
            const response = await axios.put(API_ENDPOINTS.UPDATE_POST + postDetails._id, { content: postContentInput });
            if (response.status === 200) {
                setContent(response.data.content);
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setEditing(false);
        }
    };

    const handleDeletePostClick = async () => {
        try {
            const response = await axios.delete(API_ENDPOINTS.DELETE_POST + postDetails._id);
            if (response.status === 200) {
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const convertDateTime = datetime => new Date(datetime).toLocaleString();

    return (
        <div className="post-container twitter-font">
            <div className="first-row-container">
                <div className="first-row" onClick={goToUserPage}>
                    {postUsername}
                    <span className="division-dot"> / </span>
                    {convertDateTime(postDetails.created)}
                </div>
                {isPostOwner && (
                    <div>
                        <FontAwesomeIcon className="faicon" icon={faPenToSquare} onClick={handleEditPostClick} />
                        <FontAwesomeIcon className="faicon" icon={faTrashCan} onClick={handleDeletePostClick} />
                    </div>
                )}
            </div>
            <div>
                {!editing && content}
                {editing && (
                    <div className="tweet-container">
                        <input type='text' value={postContentInput} onChange={handlePostContentChange} />
                        <div className="submit-button white-text twitter-font" onClick={submit}>Submit</div>
                    </div>
                )}
            </div>
        </div>
    );
}
