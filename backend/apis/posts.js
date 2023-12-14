const express = require('express')
const router = express.Router();
const PostsModel = require('../db/posts/posts.model');
const { isAuthorized } = require('./common.js');

// /api/posts/
router.get('/', async function(request, response) {
    try {
        const allPostsResponse = await PostsModel.getAllPosts()
        response.send(allPostsResponse);
    } catch (error) {
        console.error(error)
        return response.status(500).send(error)
    }
});

router.get('/:userId', async function(request, response) {
    const userId = request.params.userId;

    try {
        const userPostsResponse = await PostsModel.getPostsByUserId(userId)
        response.send(userPostsResponse);
    } catch (error) {
        console.error(error)
        return response.status(500).send(error)
    }
});

router.post('/', async function(request, response) {
    const newPost = request.body;

    const userId = newPost.userId;
    if (!isAuthorized(request, userId)) {
        return response.status(401).send("User is not authorized.")
    }

    try {
        const createPostResponse = await PostsModel.createPost(newPost)
        return response.send(createPostResponse)
    } catch (error) {
        console.error(error)
        return response.status(500).send(error)
    }
});

router.put('/:postId', async function(request, response) {
    const postId = request.params.postId;
    const newPostContent = request.body.content;

    let postResponse;
    try {
        postResponse = await PostsModel.getPostByPostId(postId)
    } catch (error) {
        console.error(error)
        return response.status(401).send("User is not authorized.")
    }

    const userId = postResponse?.userId;
    if (!isAuthorized(request, userId)) {
        return response.status(401).send("User is not authorized.")
    }

    try {
        const updatePostResponse = await PostsModel.updatePost(postId, newPostContent)
        return response.send(updatePostResponse)
    } catch (error) {
        console.error(error)
        return response.status(500).send(error)
    }
});

router.delete('/:postId', async function(request, response) {
    const postId = request.params.postId;

    let postResponse;
    try {
        postResponse = await PostsModel.getPostByPostId(postId)
    } catch (error) {
        console.error(error)
        return response.status(401).send("User is not authorized.")
    }

    const userId = postResponse?.userId;
    if (!isAuthorized(request, userId)) {
        return response.status(401).send("User is not authorized.")
    }

    const deleteResponse = await PostsModel.deletePost(postId)
    return response.send("Successfully deleted post")
});

module.exports = router;