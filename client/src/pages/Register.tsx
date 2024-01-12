import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import axios from 'axios'
import withLayout from '../hoc/withLayout'
import EnterForm from '../components/enterForm'

function Register() {
	const { isAuthenticated, username, checkAuthentication } = useAuth()

	const [formData, setFormData] = useState({
		user: '',
		pw: '',
	})
	let navigate = useNavigate()

	const handleRegister = async () => {
		const apiUrl = import.meta.env.VITE_REACT_APP_API_URL
		try {
			await axios.post(apiUrl + 'register', formData)
			navigate('/')

		} catch (error) {
			console.error('Error registering:', error)
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData((prevData) => ({ ...prevData, [name]: value }))
	}

	return (
		<EnterForm
			title="Register"
			formHandler={handleRegister}
			inputHandler={handleInputChange}
		/>
	)
}

export default withLayout(Register)
