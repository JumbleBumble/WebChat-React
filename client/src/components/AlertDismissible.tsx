import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'


interface AlertProps {
	title: string
	body: string
	variant:
		| 'primary'
		| 'secondary'
		| 'success'
		| 'danger'
		| 'warning'
		| 'info'
		| 'light'
		| 'dark'
	isShow: boolean
}

function AlertDismissible({ title, body, variant, isShow }: AlertProps) {
	const [show, setShow] = useState(isShow)
	const buttonVariant = 'outline-' + variant

	return (
		<div className="m-1">
			<Alert show={show} variant={variant} className="p-1">
				<Alert.Heading>{title}</Alert.Heading>
				<p>{body}</p>
				<hr />
				<div className="d-flex justify-content-end p-0 m-0">
					<Button
						onClick={() => setShow(false)}
						variant={buttonVariant}
					>
						Close
					</Button>
				</div>
			</Alert>
		</div>
	)
}



export default AlertDismissible
