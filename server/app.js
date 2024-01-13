const express = require('express')
const session = require('express-session')
var passport = require('passport')
var routes = require('./routes')
const sessionStore = require('./modules/sessionStore')
const socketModule = require('./modules/socket')
const http = require('http')
const cors = require('cors')
require('dotenv').config()

var app = express()
const server = http.createServer(app)
app.use(
	cors({
		origin: 'http://localhost:5173', //TODO change to dotenv
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
			maxAge: 1000 * 60 * 60 * 24, // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
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
app.use(routes)

app.listen(3000)

server.listen(3003, () => {
	console.log(`Server running on http://localhost:${3003}`)
})