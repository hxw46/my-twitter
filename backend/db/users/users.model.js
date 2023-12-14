const mongoose = require("mongoose")
const UsersSchema = require('./users.schema').UsersSchema;
const UsersModel = mongoose.model("User", UsersSchema);

function getAllUsers() {
    return UsersModel.find({}).exec();
}

function getUserByUserId(userId) {
    return UsersModel.findById(userId).exec();
}

function getUserByUsername(username) {
    return UsersModel.findOne({username: username}).exec();
}

function createUser(user) {
    return UsersModel.create(user);
}

function updateUser(userId, description) {
    return UsersModel.findByIdAndUpdate(userId, {description: description}, {new: true});
}

function deleteUser(userId) {
    return UsersModel.deleteOne({_id: userId}).exec();
}

module.exports = {
    getAllUsers,
    getUserByUserId,
    createUser,
    updateUser,
    deleteUser,
    getUserByUsername
}