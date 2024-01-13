import withLayout from '../hoc/withLayout'

function Home() {
	return (
		<div
			className="p-5 d-flex flex-column align-items-center justify-content-center"
			style={{ marginBottom: '50vh' }}
		>
			<h1>Vite+React(TSX) Express.js Chat Application</h1>
			<h2 className="p-4">
				Made by <a href="https://github.com/JumbleBumble">Jumble</a>
			</h2>
		</div>
	)
}

export default withLayout(Home);
