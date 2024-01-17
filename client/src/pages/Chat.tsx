import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import withLayout from '../hoc/withLayout'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '../AuthContext'
import AlertDismissible from '../components/AlertDismissible'

const socketUrl = import.meta.env.VITE_REACT_APP_SOCKET_URL

function Chat() {
	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState<
		{ username: string; message: string }[]
	>([])
	const [socket, setSocket] = useState<Socket | null>(null)
	const [connectedUsers, setConnectedUsers] = useState<string[]>([])
	const [currentRoom, setCurrentRoom] = useState<string>('main')
	const { isAuthenticated, username, checkAuthentication } = useAuth()
	const { id } = useParams()
	const containerRef = useRef<HTMLDivElement | null>(null)
	const [alert, setAlert] = useState<JSX.Element>(<></>)

	// First useEffect hook to initialize the socket connection,
	// join the room, and listen for chat messages and message history
	useEffect(() => {
		const newSocket = io(socketUrl, {
			withCredentials: true,
		})
		setSocket(newSocket)
		if (id) {
			setCurrentRoom(id)
		}

		if (newSocket) {
			newSocket.emit('joinRoom', currentRoom)

			newSocket.on(
				'chatMessage',
				(username: string, newMessage: string) => {
					setMessages((prevMessages) => [
						...prevMessages,
						{ username: username, message: newMessage },
					])
				}
			)

			newSocket.on(
				'messageHistory',
				(allMessages: { username: string; message: string }[]) => {
					setMessages(allMessages)
				}
			)
		}

		return () => {
			if (newSocket) {
				newSocket.emit('leaveRoom', currentRoom)
				newSocket.disconnect()
			}
			setSocket(null)
		}
	}, [currentRoom, id])

	// Second useEffect hook to listen for updates to the connectedUsers array
	useEffect(() => {
		if (socket) {
			socket.on('connectedUsers', (allUsers: string[]) => {
				setConnectedUsers(allUsers)
			})
		}
	}, [socket, connectedUsers])

	// Third useEffect hook to scroll to the bottom of the messages container when messages change
	useEffect(() => {
		if (containerRef && containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight
		}
	}, [messages, message])

	// Fourth useEffect hook to check authentication and display an alert if the user is not authenticated
	useEffect(() => {
		const CheckAuthAlert = async () => {
			if (!isAuthenticated) {
				const authed = await checkAuthentication()

				if (!authed) {
					setAlert(
						<AlertDismissible
							key={new Date().getTime()}
							title="Not Authorized"
							body="You must be authorized to view this page!"
							variant="danger"
							isShow={true}
						/>
					)
				}
			}
		}
		CheckAuthAlert()
	}, [])

	const sendMessage = () => {
		if (message.trim() !== '' && socket !== null) {
			socket.emit('chatMessage', { room: currentRoom, message })
			setMessage('')
		}
	}
	return (
		<>
			{alert}
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
												<p className="card-text">
													{user}
												</p>
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
							ref={containerRef}
							id="messagesList"
						>
							{messages.map((msg, index) => (
								<div className="card" key={index}>
									<div className="card-body">
										<p className="card-text">
											<b>{msg.username}</b>:{' '}
											{msg.message}
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
		</>
	)
}

export default withLayout(Chat)
