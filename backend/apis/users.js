const express = require('express');
const router = express.Router();
const UsersModel = require('../db/users/users.model');
const jwt = require('jsonwebtoken');
const { isAuthentic, isAuthorized } = require('./common.js');

const SECRET_KEY = "Camille's password";

async function handleResponse(promise, response) {
    try {
        const result = await promise;
        response.send(result);
    } catch (error) {
        console.error(error);
        response.status(500).send(error);
    }
}

function generateToken(userId, username) {
    const jwtPayload = { userId, username };
    return jwt.sign(jwtPayload, SECRET_KEY);
}

router.get('/', (request, response) => {
    handleResponse(UsersModel.getAllUsers(), response);
});

router.get('/loggedinuser', (request, response) => {
    if (!isAuthentic(request)) {
        return response.send({ userId: null, username: null });
    }

    const jwtPayload = request.cookies.userToken;
    const decryptedJwtPayload = jwt.verify(jwtPayload, SECRET_KEY);
    response.send(decryptedJwtPayload);
});

router.get('/:userId', (request, response) => {
    handleResponse(UsersModel.getUserByUserId(request.params.userId), response);
});

router.get('/username/:username', (request, response) => {
    handleResponse(UsersModel.getUserByUsername(request.params.username), response);
});

router.post('/register', (request, response) => {
    const { username, password } = request.body;

    if (!username || !password) {
        return response.status(400).send({ message: "Must include username AND password" });
    }

    handleResponse(UsersModel.createUser(request.body).then(user => {
        response.cookie("userToken", generateToken(user._id, user.username));
        return user;
    }), response);
});

router.put('/:userId', (request, response) => {
    const { userId } = request.params;

    if (!isAuthorized(request, userId)) {
        return response.status(401).send("User is not authorized to perform this action.");
    }

    handleResponse(UsersModel.updateUser(userId, request.body.description), response);
});

router.delete('/:userId', (request, response) => {
    const { userId } = request.params;

    if (!isAuthorized(request, userId)) {
        return response.status(401).send("User is not authorized to perform this action.");
    }

    handleResponse(UsersModel.deleteUser(userId), response);
    response.send("Successfully deleted user");
});

router.post('/login', (request, response) => {
    const { username, password } = request.body;

    if (!username || !password) {
        return response.status(400).send({ message: "Must include username AND password" });
    }

    handleResponse(UsersModel.getUserByUsername(username).then(user => {
        if (user.password !== password) {
            return response.status(403).send("Username or password is incorrect.");
        }

        response.cookie("userToken", generateToken(user._id, username));
        return "Logged in successfully";
    }), response);
});

router.post('/logout', (request, response) => {
    response.cookie('userToken', '', { maxAge: 0 });
    response.send(true);
});

module.exports = router;
