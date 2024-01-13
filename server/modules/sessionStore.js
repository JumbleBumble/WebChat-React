const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connection = require('../config/connection')

const sessionStore = new MongoStore({
	mongooseConnection: connection,
	collection: 'sessions',
})

module.exports = sessionStore
