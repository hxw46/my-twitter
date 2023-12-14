const mongoose = require("mongoose")
const PostsSchema = require('./posts.schema').PostsSchema;
const PostsModel = mongoose.model("Post", PostsSchema);

function getAllPosts() {
    return PostsModel.find({}).sort({_id:-1}).exec();
}

function getPostsByUserId(userId) {
    return PostsModel.find({userId: userId}).sort({_id:-1}).exec();
}

function getPostByPostId(postId) {
    return PostsModel.findById(postId).exec();
}

function createPost(post) {
    return PostsModel.create(post);
}

function updatePost(postId, content) {
    return PostsModel.findByIdAndUpdate(postId, {content: content}, {new: true});
}

function deletePost(postId) {
    return PostsModel.deleteOne({_id: postId}).exec();
}

module.exports = {
    getAllPosts,
    getPostsByUserId,
    getPostByPostId,
    createPost,
    deletePost,
    updatePost
}