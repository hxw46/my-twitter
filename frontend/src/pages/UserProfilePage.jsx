import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import axios from 'axios';
import Feed from '../components/Feed';
import CreatePost from '../components/CreatePost';
import "./UserProfilePage.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { useLocation } from "react-router-dom";

export default function UserProfilePage() {
    const [userProfile, setUserProfile] = useState({ username: "", userId: "", description: "", joined: "" });
    const [posts, setPosts] = useState([]);
    const [isProfileOwner, setIsProfileOwner] = useState(false);
    const [loggedInUserId, setLoggedInUserId] = useState("");
    const [editingDescription, setEditingDescription] = useState(false);
    const [descriptionInput, setDescriptionInput] = useState("");

    const location = useLocation();

    useEffect(() => {
        const fetchUserProfileAndLoggedInUser = async () => {
            try {
                const userId = location.state.userId;
                const [userResponse, loggedInResponse] = await Promise.all([
                    axios.get('/api/users/' + userId),
                    axios.get('/api/users/loggedinuser')
                ]);

                setUserProfile({
                    username: userResponse.data.username,
                    userId: userId,
                    description: userResponse.data.description,
                    joined: userResponse.data.joined
                });
                setDescriptionInput(userResponse.data.description);

                const loggedInUserId = loggedInResponse.data.userId;
                setLoggedInUserId(loggedInUserId);
                setIsProfileOwner(userId === loggedInUserId);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserProfileAndLoggedInUser();
    }, [location.state.userId]);

    useEffect(() => {
        const fetchPosts = async () => {
            if (!userProfile.userId) {
                return;
            }

            try {
                const response = await axios.get(`/api/posts/${userProfile.userId}`);
                setPosts(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPosts();
    }, [userProfile.userId]);

    const convertDateTime = datetime => new Date(datetime).toLocaleString();

    const handleDescriptionChange = event => setDescriptionInput(event.target.value);

    const handleEditDescriptionClick = () => setEditingDescription(true);

    const submit = async () => {
        if (!descriptionInput) return;

        try {
            const response = await axios.put(`/api/users/${userProfile.userId}`, { description: descriptionInput });
            if (response.status === 200) {
                setUserProfile(prevState => ({ ...prevState, description: response.data.description }));
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setEditingDescription(false);
        }
    };

    return (
        <div>
            <NavBar />
            <div className="user-container">
                <div className="username-title twitter-font">{userProfile.username}</div>
                {!editingDescription ? (
                    <div className="description-and-edit description-container">
                        <div className="user-description twitter-font">{userProfile.description}</div>
                        {isProfileOwner && <FontAwesomeIcon icon={faPenToSquare} onClick={handleEditDescriptionClick} />}
                    </div>
                ) : (
                    <div className="input-and-submit description-container">
                        <input
                            className="input-edit-description"
                            type='text'
                            value={descriptionInput}
                            onChange={handleDescriptionChange}
                        />
                        <div className="submit-button-edit-description white-text twitter-font" onClick={submit}>Save</div>
                    </div>
                )}
            </div>
            {isProfileOwner && <CreatePost username={userProfile.username} userId={userProfile.userId} />}
            <Feed posts={posts} />
        </div>
    );
}
