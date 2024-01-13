const mongoose = require('mongoose')
const connection = require('../config/connection')

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

const Message = connection.model('Message', MessageSchema)

module.exports = Message
