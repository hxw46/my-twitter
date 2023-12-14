const Schema = require('mongoose').Schema;

exports.PostsSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    created: { 
        type: Date, 
        default: Date.now,
    },
    content: {
        type: String,
        required: true,
    }

}, { collection : 'posts' });