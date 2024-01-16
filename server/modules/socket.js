const socketIO = require('socket.io')
const cookie = require('cookie')
const User = require('../models/User')
const Message = require('../models/message')

module.exports = (server, sessionStore) => {
	const io = socketIO(server, {
		cors: {
			origin: 'http://localhost:5173',
			methods: ['GET', 'POST'],
			credentials: true,
		},
	})

	io.use(async (socket, next) => {
		try {
			const parsedCookies = cookie.parse(socket.request.headers.cookie)
			const connectSidValue = parsedCookies['connect.sid']
			if (connectSidValue) {
				const sessionID = connectSidValue.split('.')[0].split(':')[1]
				const session = await sessionStore.get(sessionID)
				const passportSessionUser = session?.passport?.user || null

				if (passportSessionUser) {
					socketUser = await User.findById(passportSessionUser)
						.select('username')
						.lean()
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

	const connectedUsers = {}
	io.on('connection', async (socket) => {
		socket.on('joinRoom', async (room) => {
			connectedUsers[room] = connectedUsers[room] || []
			socket.join(room)
			if (!connectedUsers[room].includes(socket.user)) {
				connectedUsers[room].push(socket.user)
			}
			io.to(room).emit('connectedUsers', connectedUsers[room])
			let limit = -1
			if (room == 'main') {
				limit = 30
			}
			const roomHistory = await Message.find({ room: room })
				.sort({ createdAt: 1 })
				.limit(limit)
				.exec()

			if (roomHistory && roomHistory.length !== 0) {
				messageHistory = roomHistory.map(({ username, message }) => ({
					username,
					message,
				}))
				if (messageHistory && messageHistory.length !== 0) {
					io.to(room).emit('messageHistory', messageHistory)
				}
			}
		})

		socket.on('leaveRoom', async (room) => {
			socket.leave(room)
			connectedUsers[room] = connectedUsers[room] || []

			connectedUsers[room] = connectedUsers[room].filter(
				(user) => user !== socket.user
			)

			io.to(room).emit('connectedUsers', connectedUsers[room])
		})

		socket.on('chatMessage', async ({ room, message }) => {
			io.to(room).emit('chatMessage', socket.user, message)

			const newMessage = new Message({
				username: socket.user,
				message: message,
				room: room,
			})

			newMessage.save()
		})

		socket.on('disconnect', async () => {
			//placeholder
		})
	})
}
