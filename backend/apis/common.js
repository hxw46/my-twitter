const jwt = require('jsonwebtoken');

const secretKey = "Camille's password";

function verifyToken(jwtPayload) {
    try {
        return jwt.verify(jwtPayload, secretKey);
    } catch (e) {
        console.error(e);
        return null;
    }
}

function isAuthentic(request) {
    const jwtPayload = request.cookies.userToken;
    if (!jwtPayload) {
        return false;
    }

    const decryptedJwtPayload = verifyToken(jwtPayload);
    if (!decryptedJwtPayload) {
        return false;
    }

    const { userId, username } = decryptedJwtPayload;
    if (!userId || !username) {
        console.info(`UserId ${userId} or username ${username} is null.`);
        return false;
    }
    
    return true;
}

function isAuthorized(request, userId) {
    if (!isAuthentic(request)) {
        return false;
    }

    const jwtPayload = request.cookies.userToken;
    const decryptedJwtPayload = verifyToken(jwtPayload);
    return decryptedJwtPayload ? userId === decryptedJwtPayload.userId : false;
}

exports.isAuthentic = isAuthentic;
exports.isAuthorized = isAuthorized;
