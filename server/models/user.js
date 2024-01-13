const mongoose = require('mongoose')
const connection = require('../config/connection')

const UserSchema = new mongoose.Schema({
	username: String,
	hash: String,
	salt: String,
	admin: Boolean,
})

const User = connection.model('User', UserSchema)

module.exports = User
