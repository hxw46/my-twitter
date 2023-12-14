import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import NavBar from '../components/NavBar';
import "./LoginOrRegister.css";
import axios from 'axios';

export default function CreateUserPage() {
    const [inputs, setInputs] = useState({ username: '', password: '', description: '' });
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleInputChange = (field) => (event) => {
        setErrorMessage('');
        setInputs({ ...inputs, [field]: event.target.value });
    };

    async function submit() {
        setErrorMessage('');

        if (!inputs.username || !inputs.password) {
            setErrorMessage('* Please provide a username and password.');
            return;
        }

        try {
            await axios.post('/api/users/register', inputs);
            navigate('/');
        } catch (e) {
            console.error(e);
            setErrorMessage("Something went wrong.");
        }
    }

    return (
        <div>
            <NavBar />
            <div className="login-register-container">
                <h1 className="title twitter-font">Register</h1>
                <div className="login-register-contents">
                    <div className="input-row twitter-font">
                        <span>Username: </span>
                        <input type='text' value={inputs.username} onChange={handleInputChange('username')}></input>
                        <span className="asterisk"> *</span>
                    </div>
                    <div className="input-row twitter-font">
                        <span className="password-span">Password: </span>
                        <input type='password' value={inputs.password} onChange={handleInputChange('password')}></input>
                        <span className="asterisk"> *</span>
                    </div>
                    <div className="input-row twitter-font">
                        <span className="tag-span">Your Tag: </span>
                        <input type='text' value={inputs.description} onChange={handleInputChange('description')}></input>
                    </div>
                    <div className="submit-button twitter-font white-text" onClick={submit}>Sign Up</div>
                    {errorMessage && <div className="error twitter-font">{errorMessage}</div>}
                </div>
            </div>
        </div>
    );
}
