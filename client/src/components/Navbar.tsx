import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import axios from 'axios'

function Navbar() {
    const { isAuthenticated, username, checkAuthentication } = useAuth()

	let navigate = useNavigate()

	const handleLogout = async () => {
		const apiUrl = import.meta.env.VITE_REACT_APP_API_URL
		try {
			await axios.get(apiUrl + 'logout', {
				withCredentials: true,
			})
			checkAuthentication()
			navigate('/')
		} catch (error) {
			console.error('Error registering:', error)
		}
	}

	return (
		<nav className="navbar navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow mb-3">
			<div className="container-fluid">
				<Link className="navbar-brand" to="/">
					WebChat
				</Link>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNavAltMarkup"
					aria-controls="navbarNavAltMarkup"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse">
					<div className="navbar-nav">
						<Link className="nav-link" to="/">
							Home
						</Link>
						{isAuthenticated && (
							<>
								<Link className="nav-link" to="/chat/main">
									Chat
								</Link>
								<Link className="nav-link" to="/groups">
									Chat Groups
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
			<ul className="navbar-nav">
				{isAuthenticated ? (
					<>
						<li className="nav-item" style={{ height: '0px' }}>
							Hello {username}!
						</li>
						<button
							className="nav-link me-5"
							onClick={handleLogout}
						>
							Logout
						</button>
					</>
				) : (
					<>
						<Link className="nav-link" to="/register">
							Register
						</Link>
						<Link className="nav-link me-5" to="/login">
							Login
						</Link>
					</>
				)}
			</ul>
		</nav>
	)
}

export default Navbar
