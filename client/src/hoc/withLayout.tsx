import React from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

const withLayout = (WrappedComponent: React.FC) => {
	return () => (
		<>
			<Navbar />
			<WrappedComponent />
			<Footer />
		</>
	)
}

export default withLayout
