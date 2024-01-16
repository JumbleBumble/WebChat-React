import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { ReactSVG } from 'react-svg'
import { isMobile } from 'react-device-detect'
import purpleconf from '../assets/purpleconf.svg'
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
		<nav className="navbar navbar-expand-sm navbar-toggleable-sm">
			{isMobile ? (
				<div className="navbar-svg navbar-mobile"></div>
			) : (
				<div className="navbar-svg animato">
					<ReactSVG src={purpleconf} />
				</div>
			)}
			<div className="container-fluid">
				<Link className="navbar-brand text-light" to="/">
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
						<Link className="nav-link text-light" to="/">
							Home
						</Link>
						{isAuthenticated && (
							<>
								<Link
									className="nav-link text-light"
									to="/chat/main"
								>
									Chat
								</Link>
								<Link
									className="nav-link text-light"
									to="/groups"
								>
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
						<li
							className="nav-item text-light"
							style={{ height: '0px' }}
						>
							Hello {username}!
						</li>
						<button
							className="nav-link text-light py-3 me-5"
							onClick={handleLogout}
						>
							Logout
						</button>
					</>
				) : (
					<>
						<Link className="nav-link text-light" to="/register">
							Register
						</Link>
						<Link className="nav-link text-light me-5" to="/login">
							Login
						</Link>
					</>
				)}
			</ul>
		</nav>
	)
}

export default Navbar
