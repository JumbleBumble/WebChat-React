import { Link } from 'react-router-dom'

function Footer() {
	return (
		<footer className="bg-orange footer-back py-3">
			<ul className="nav justify-content-center pb-3">
				<li className="nav-item">
					<Link className="nav-link px-2 text-light" to="/">
						Home
					</Link>
				</li>
				<li className="nav-item">
					<Link className="nav-link px-2 text-light" to="/chat/main">
						Chat
					</Link>
				</li>
				<li className="nav-item">
					<Link className="nav-link px-2 text-light" to="/groups">
						Chat Groups
					</Link>
				</li>
			</ul>
			<p className="text-center text-light">© 2023 Company, Inc</p>
		</footer>
	)
}

export default Footer
