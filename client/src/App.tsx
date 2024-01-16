import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Chat from './pages/Chat'
import Groups from './pages/Groups'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'

//color scheme: Primary: #FF7700 Secondary: #AA0000 Secondary-light:#CC0000 alt: #AA00AA alt-dark: #880088

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

export default App;
