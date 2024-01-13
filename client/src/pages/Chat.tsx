import { useEffect, useState } from 'react'
import withLayout from '../hoc/withLayout'
import { io, Socket } from 'socket.io-client'

const socketUrl = import.meta.env.VITE_REACT_APP_SOCKET_URL

function Chat() {
	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState<string[]>([])
	const [socket, setSocket] = useState<Socket | null>(null)
	const [connectedUsers, setConnectedUsers] = useState<string[]>([])

	useEffect(() => {
		const newSocket = io(socketUrl, {
			withCredentials: true,
		})
		setSocket(newSocket)
		newSocket.emit('joinRoom', 'main')

		newSocket.on('chatMessage', (newMessage: string) => {
			setMessages((prevMessages) => [...prevMessages, newMessage])
		})

		newSocket.on('connectedUsers', (allUsers: string[]) => {
			setConnectedUsers(allUsers)
		})

		newSocket.on('messageHistory', (allMessages: string[]) => {
			setMessages(allMessages)
		})

		return () => {
			newSocket.disconnect()
			setSocket(null)
		}
	}, [])

	const sendMessage = () => {
		if (message.trim() !== '' && socket !== null) {
			socket.emit('chatMessage', { room: 'main', message })
			setMessage('')
		}
	}
	return (
		<div>
			<div className="container">
				<div className="row row-cols-1">
					<div className="col p-3">
						<div className="container">
							<h2 className="d-flex justify-content-center">
								Connected Users
							</h2>
							<div
								className="overflow-auto d-grid gap-2"
								id="usersList"
								style={{ maxHeight: '10em' }}
							>
								{connectedUsers.map((user, index) => (
									<div className="card" key={index}>
										<div className="card-body">
											<p className="card-text">{user}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
				<div className="row p-1">
					<hr />
					<div className="col-6"></div>
				</div>
				<div className="row p-1">
					<div
						className="container d-flex flex-column overflow-auto gap-3"
						style={{ height: '55vh' }}
						id="messagesList"
					>
						{messages.map((msg, index) => (
							<div className="card" key={index}>
								<div className="card-body">
									<p className="card-text">
										<b>User</b>: {msg}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
				<div className="row p-1">
					<div className="container d-flex">
						<input
							type="text"
							id="messageInput"
							className="flex-fill p-1 rounded"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
						/>
						<button
							id="sendButton"
							className="btn btn-primary rounded ms-2"
							onClick={sendMessage}
						>
							Send
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default withLayout(Chat)
