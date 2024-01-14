const mongoose = require('mongoose')
const connection = require('../config/connection')

const GroupSchema = new mongoose.Schema({
	users: {
		type: [String],
		default: [],
	},
})

const Group = connection.model('Group', GroupSchema)

module.exports = Group
