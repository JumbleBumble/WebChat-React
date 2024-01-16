import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import withLayout from '../hoc/withLayout'
import { io, Socket } from 'socket.io-client'

const socketUrl = import.meta.env.VITE_REACT_APP_SOCKET_URL

function Chat() {
	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState<
		{ username: string; message: string }[]
	>([])
	const [socket, setSocket] = useState<Socket | null>(null)
	const [connectedUsers, setConnectedUsers] = useState<string[]>([])
	const [currentRoom, setCurrentRoom] = useState<string>('main')
	const { id } = useParams()

	useEffect(() => {
		const newSocket = io(socketUrl, {
			withCredentials: true,
		})
		setSocket(newSocket)
		if (id) {
			setCurrentRoom(id)
		}
		newSocket.emit('joinRoom', currentRoom)

		newSocket.on('chatMessage', (username: string, newMessage: string) => {
			setMessages((prevMessages) => [
				...prevMessages,
				{ username: username, message: newMessage },
			])
		})

		newSocket.on(
			'messageHistory',
			(allMessages: { username: string; message: string }[]) => {
				setMessages(allMessages)
			}
		)

		return () => {
			newSocket.emit('leaveRoom', currentRoom)
			newSocket.disconnect()
			setSocket(null)
		}
	}, [currentRoom, id])

	useEffect(() => {
		if (socket) {
			socket.on('connectedUsers', (allUsers: string[]) => {
				setConnectedUsers(allUsers)
			})
		}
	}, [socket, connectedUsers])

	const sendMessage = () => {
		if (message.trim() !== '' && socket !== null) {
			socket.emit('chatMessage', { room: currentRoom, message })
			setMessage('')
		}
	}
	return (
		<div className="bg-orange">
			<div className="container">
				<div className="row row-cols-1">
					<div className="col p-3">
						<div className="container">
							<h2 className="d-flex justify-content-center text-light">
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
										<b>{msg.username}</b>: {msg.message}
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
							className="flex-fill p-1 rounded input-solid"
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
