import withLayout from '../hoc/withLayout'
import HoverAnimation from '../components/LinkAnimation'

function Home() {
	return (
		<div
			className="home-back p-5 d-flex flex-column align-items-center justify-content-center"
			style={{ height: '90vh' }}
		>
			<h1 className="text-light">
				Vite+React(TSX) Express.js Chat Application
			</h1>
			<HoverAnimation />
		</div>
	)
}

export default withLayout(Home)
