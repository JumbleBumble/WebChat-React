const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
var passport = require('passport');
var crypto = require('crypto');
var routes = require('./routes');
const cookie = require('cookie')
const http = require('http')
const socketIO = require('socket.io')
const cors = require('cors')
const connection = require('./config/database')
const User = connection.models.User
const MongoStore = require('connect-mongo')(session)
require('dotenv').config()

var app = express()
const server = http.createServer(app)
const io = socketIO(server, {
	cors: {
		origin: 'http://localhost:5173',
		methods: ['GET', 'POST'],
		credentials: true,
	},
})
app.use(
	cors({
		origin: 'http://localhost:5173', //TODO change to dotenv
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
	})
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const sessionStore = new MongoStore({
	mongooseConnection: connection,
	collection: 'sessions',
})

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

io.use(async (socket, next) => {
	try {
		const parsedCookies = cookie.parse(socket.request.headers.cookie)
		const connectSidValue = parsedCookies['connect.sid']
		console.log(connectSidValue)
		if (connectSidValue) {
			const sessionID = connectSidValue.split('.')[0].split(':')[1]
			const session = await sessionStore.get(sessionID)
			const passportSessionUser = session?.passport?.user || null

			if (passportSessionUser) {
				socketUser = await User.findById(passportSessionUser)
					.select('username')
					.lean()
				console.log(socketUser)
				if (socketUser && socketUser.username) {
					socket.user = socketUser.username
					return next()
				}
			}
			throw new Error('User not found')
		}
		throw new Error('Session not found')
	} catch (error) {
		return next(new Error('Authentication error'))
	}
})

//TODO save room messages to DB instead
const connectedUsers = []
const roomMessages = {}
io.on('connection', (socket) => {
	console.log('A user connected:', socket.user)
	connectedUsers.push(socket.user)

	socket.on('joinRoom', (room) => {
		socket.join(room)
		io.to(room).emit('connectedUsers', connectedUsers)
		if (roomMessages[room] && roomMessages[room].length !== 0) {
			io.to(room).emit('messageHistory', roomMessages[room])
		}
		console.log(`User joined room: ${room}`)
	})

	socket.on('leaveRoom', (room) => {
		socket.leave(room)
		console.log(`User left room: ${room}`)
	})

	socket.on('chatMessage', ({ room, message }) => {
		console.log('Room:', { room }, 'Message:', message)
		io.to(room).emit('chatMessage', message)
		//const timestamp = new Date().toISOString()

		//const newMessage = {
		//room,
		//message,
		//timestamp,
		//}

		if (!roomMessages[room]) {
			roomMessages[room] = []
		}

		roomMessages[room].push(message)
	})

	socket.on('disconnect', () => {
		console.log('User disconnected')
		connectedUsers.pop(socket.user)
	})
})

app.use((req, res, next) => {
	next()
})
app.use(routes)

app.listen(3000)

server.listen(3003, () => {
	console.log(`Server running on http://localhost:${3003}`)
})