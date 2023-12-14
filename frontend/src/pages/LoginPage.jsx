import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import NavBar from '../components/NavBar';
import "./LoginOrRegister.css";
import axios from 'axios';

export default function LoginPage() {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleInputChange = (setter) => (event) => {
        setErrorMessage('');
        setter(event.target.value);
    };

    const submit = async () => {
        if (!usernameInput || !passwordInput) {
            setErrorMessage('* Please enter a username and password to login.');
            return;
        }

        try {
            const response = await axios.post('/api/users/login', {
                username: usernameInput,
                password: passwordInput
            }, {
                validateStatus: status => status < 500
            });

            if (response.status === 200) {
                navigate('/');
            } else if ([401, 403].includes(response.status)) {
                setErrorMessage("Invalid username or password, please try again.");
            } else {
                throw new Error(response.data);
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Something went wrong.");
        }
    };

    return (
        <div>
            <NavBar />
            <div className="login-register-container">
                <h1 className="title twitter-font">Login</h1>
                <div className="login-register-contents">
                    <div className="input-row twitter-font">
                        <span>Username: </span>
                        <input type='text' value={usernameInput} onInput={handleInputChange(setUsernameInput)}></input>
                        <span className="asterisk"> *</span>
                    </div>
                    <div className="input-row twitter-font">
                        <span className="password-span">Password: </span>
                        <input type='password' value={passwordInput} onInput={handleInputChange(setPasswordInput)}></input>
                        <span className="asterisk"> *</span>
                    </div>
                    <div className="submit-button twitter-font white-text" onClick={submit}>Login</div>
                    {errorMessage && <div className="error twitter-font">{errorMessage}</div>}
                </div>
            </div>
        </div>
    );
}
