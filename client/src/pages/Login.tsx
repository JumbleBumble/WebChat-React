import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import withLayout from '../hoc/withLayout'
import { useAuth } from '../AuthContext'
import EnterForm from '../components/enterForm'
import AlertDismissible from '../components/AlertDismissible'


const apiUrl = import.meta.env.VITE_REACT_APP_API_URL

function Login() {
	const { isAuthenticated, username, checkAuthentication } = useAuth()
	const [formData, setFormData] = useState({
		user: '',
		pw: '',
	})
	const [alert, setAlert] = useState<JSX.Element>(<></>)

	let navigate = useNavigate()

	const handleLogin = async () => {
		try {
			await axios.post(
				apiUrl + 'login',
				formData,
				{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					withCredentials: true,
				},
			)
			const authed = await checkAuthentication();
			if (authed) {
				navigate('/')
			} else {
				setAlert(
				<AlertDismissible
					title="Failed login"
					body="Invalid credentials"
					variant="danger"
					isShow={true}
				/>
			)}

		} catch (error) {
			setAlert(
				<AlertDismissible
					title="Failed login"
					body="Invalid credentials"
					variant="danger"
					isShow={true}
				/>
			)
			console.error('Error logging in:', error)
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData((prevData) => ({ ...prevData, [name]: value }))
	}

	return( 
	<div>
		{alert}
		<EnterForm title="Login" formHandler={handleLogin} inputHandler={handleInputChange} />
	</div>
	)
}

export default withLayout(Login);
