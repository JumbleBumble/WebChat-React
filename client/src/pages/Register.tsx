import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import axios from 'axios'
import withLayout from '../hoc/withLayout'
import AlertDismissible from '../components/AlertDismissible'
import EnterForm from '../components/enterForm'

function Register() {
	const { isAuthenticated, username, checkAuthentication } = useAuth()
	const [alert, setAlert] = useState<JSX.Element>(<></>)
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
		} catch (error: any) {
			setAlert(
				<AlertDismissible
					key={new Date().getTime()}
					title="Failed to register"
					body={error.response.data}
					variant="danger"
					isShow={true}
				/>
			)
			console.error('Error registering:', error)
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData((prevData) => ({ ...prevData, [name]: value }))
	}

	useEffect(() => {
		//redirecting to the homepage if the user is already authenticated
		if (isAuthenticated) {
			navigate('/')
		}
	}, [isAuthenticated, navigate])

	return (
		<div>
			{alert}
			<EnterForm
				title="Register"
				formHandler={handleRegister}
				inputHandler={handleInputChange}
			/>
		</div>
	)
}

export default withLayout(Register)
