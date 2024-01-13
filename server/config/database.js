const mongoose = require('mongoose')
require('dotenv').config()

const conn = process.env.DB_STRING

const connection = mongoose.createConnection(conn, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

const UserSchema = new mongoose.Schema({
	username: String,
	hash: String,
	salt: String,
	admin: Boolean,
})

const MessageSchema = new mongoose.Schema(
	{
		username: String,
		message: String,
		room: String,
	},
	{
		timestamps: true,
	}
)

const User = connection.model('User', UserSchema)
const Message = connection.model('Message', MessageSchema)

module.exports = connection
