import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'
import axios from 'axios'

interface AuthContextProps {
	isAuthenticated: boolean
	username: string | null
	checkAuthentication: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

interface AuthProviderProps {
	children: ReactNode
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
	const [username, setUsername] = useState<string | null>(null)

	async function checkAuthentication() {
		try {
			const apiUrl = import.meta.env.VITE_REACT_APP_API_URL

			const response = await axios.get(apiUrl + 'check-auth', {
				withCredentials: true,
			})

			if (response.status == 200) {
				setIsAuthenticated(true)

				if (response.data.user) {
					setUsername(response.data.user)
				}

				return true
			}
		} catch (error) {
			setIsAuthenticated(false)
			setUsername(null)
			return false
		}
		return false
	}

	useEffect(() => {
		checkAuthentication()
	}, [])

	const contextValue: AuthContextProps = {
		isAuthenticated,
		username,
		checkAuthentication,
	}

	return (
		<AuthContext.Provider value={contextValue}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}

export default AuthProvider
