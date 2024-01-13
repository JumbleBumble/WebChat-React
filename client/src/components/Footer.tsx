import { Link } from 'react-router-dom'

function Footer() {
	return (
		<footer className="">
			<ul className="nav justify-content-center border-bottom pb-3 mb-3">
				<li className="nav-item">
					<Link className="nav-link px-2 text-body-secondary" to="/">
						Home
					</Link>
				</li>
				<li className="nav-item">
					<Link
						className="nav-link px-2 text-body-secondary"
						to="/chat"
					>
						Chat
					</Link>
				</li>
				<li className="nav-item">
					<Link
						className="nav-link px-2 text-body-secondary"
						to="/groups"
					>
						Chat Groups
					</Link>
				</li>
			</ul>
			<p className="text-center text-body-secondary">
				© 2023 Company, Inc
			</p>
		</footer>
	)
}

export default Footer
