import React, { useState, useEffect } from 'react';
import "./NavBar.css";
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URLS = {
    LOGIN_STATUS: '/api/users/loggedinuser',
    LOGOUT: '/api/users/logout',
};

export default function NavBar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userDetails, setUserDetails] = useState({ username: "", userId: "" });

    useEffect(() => {
        checkLoginStatus();
    }, []);

    useEffect(() => {
        setIsLoggedIn(!!(userDetails.username && userDetails.userId));
    }, [userDetails]);

    const checkLoginStatus = async () => {
        try {
            const response = await axios.get(API_URLS.LOGIN_STATUS);
            setUserDetails({ username: response.data.username, userId: response.data.userId });
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await axios.post(API_URLS.LOGOUT);
            if (response.status === 200) {
                setUserDetails({ username: "", userId: "" });
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="navbar sticky-pos white-text twitter-font">
            <Link className="left-component" to={"/"}>X</Link>
            <div className="right-component">
                {isLoggedIn && (
                    <>
                        <div className="Hi navbar-button">Hi, {userDetails.username}!</div>
                        <Link className="logout-button navbar-button" to={"/"} onClick={handleLogout}>Logout</Link>
                    </>
                )}
                {!isLoggedIn && (
                    <>
                        <Link className="login-button navbar-button" to={"/login"}>Login</Link>
                        <Link className="register-button navbar-button" to={"/register"}>Register</Link>
                    </>
                )}
            </div>
        </div>
    );
}