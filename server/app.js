const express = require('express')
const session = require('express-session')
var passport = require('passport')
var auth_route = require('./routes/auth')
var group_route = require('./routes/group')
const sessionStore = require('./modules/sessionStore')
const socketModule = require('./modules/socket')
const http = require('http')
const cors = require('cors')
require('dotenv').config()

var app = express()
const server = http.createServer(app)
app.use(
	cors({
		origin: process.env.CORS_URL,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
	})
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: true,
		store: sessionStore,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24, //(1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
		},
	})
)

require('./config/passport')
app.use(passport.initialize())
app.use(passport.session())

socketModule(server, sessionStore)

app.use((req, res, next) => {
	next()
})
app.use(auth_route)
app.use(group_route)

app.listen(parseInt(process.env.PORT), () => {
	console.log(`Express Server running on port ${process.env.PORT}`)
})

server.listen(parseInt(process.env.IO_PORT), () => {
	console.log(`Socket.IO Server running on port ${process.env.IO_PORT}`)
})
