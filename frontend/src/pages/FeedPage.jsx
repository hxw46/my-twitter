import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import CreatePost from '../components/CreatePost';
import Feed from '../components/Feed';
import axios from 'axios';
import "./FeedPage.css";

export default function FeedPage() {
    const [posts, setPosts] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState({ username: "", userId: "", isLoggedIn: false });

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get("/api/posts/");
                setPosts(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPosts();
    }, [loggedInUser.isLoggedIn]);

    useEffect(() => {
        const checkIfLoggedIn = async () => {
            try {
                const response = await axios.get('/api/users/loggedinuser');
                if (response.data.username && response.data.userId) {
                    setLoggedInUser({ 
                        username: response.data.username, 
                        userId: response.data.userId, 
                        isLoggedIn: true 
                    });
                }
            } catch (error) {
                console.error(error);
            }
        };

        checkIfLoggedIn();
    }, []);

    return (
        <div>
            <NavBar />
            <div className="feed-outer-container">
                {loggedInUser.isLoggedIn && 
                    <CreatePost username={loggedInUser.username} userId={loggedInUser.userId} />}
                <Feed posts={posts} />
            </div>
        </div>
    );
}
