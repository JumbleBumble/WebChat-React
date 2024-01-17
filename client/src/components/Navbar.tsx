import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { ReactSVG } from 'react-svg'
import { isMobile } from 'react-device-detect'
import { Nav, Container, Navbar as NvBar } from 'react-bootstrap'
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
		<NvBar expand="sm">
			{isMobile ? (
				<div className="navbar-svg navbar-mobile"></div>
			) : (
				<div className="navbar-svg nav-anim">
					<ReactSVG src={purpleconf} />
				</div>
			)}
			<Container fluid>
				<Link className="navbar-brand text-light" to="/">
					WebChat
				</Link>
				<NvBar.Toggle aria-controls="basic-navbar-nav" />
				<NvBar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
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
					</Nav>

					{isAuthenticated ? (
						<>
							{isMobile ? (
								<button
									className="nav-link text-light py-3"
									onClick={handleLogout}
								>
									Logout
								</button>
							) : (
								<ul className="navbar-nav">
									<li className="nav-item text-light py-3">
										Hello {username}!
									</li>
									<button
										className="nav-link text-light py-3 me-5"
										onClick={handleLogout}
									>
										Logout
									</button>
								</ul>
							)}
						</>
					) : (
						<ul className="navbar-nav">
							<Link
								className="nav-link text-light"
								to="/register"
							>
								Register
							</Link>
							<Link
								className="nav-link text-light me-5"
								to="/login"
							>
								Login
							</Link>
						</ul>
					)}
				</NvBar.Collapse>
			</Container>
		</NvBar>
	)
}

export default Navbar
