const Schema = require('mongoose').Schema;

exports.UsersSchema = new Schema({
    username: { 
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    joined: { 
        type : Date,
        default: Date.now,
    },
    description: String,

}, { collection : 'users' });