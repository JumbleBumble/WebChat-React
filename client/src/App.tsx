import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Importing the page components
import Chat from './pages/Chat'
import Groups from './pages/Groups'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/chat/:id" element={<Chat />} />
				<Route path="/groups" element={<Groups />} />
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</Router>
	)
}

export default App
