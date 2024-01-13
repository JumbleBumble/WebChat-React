import withLayout from '../hoc/withLayout'
import { useState } from 'react'
import { ModalBody, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

function Groups() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

	return (
		<div style={{ marginBottom: '69.67vh' }}>
			<div
				className="card rounded-3 shadow-sm mx-auto my-4"
				style={{ maxWidth: '50vw' }}
			>
				<div className="card-header d-flex align-items-center mb-0 pb-0 rounded">
					<h4 className="flex-grow-1 mb-0">Group Messages</h4>
					<button
						onClick={handleShow}
						className="btn btn-primary rounded-circle m-2"
						data-bs-toggle="modal"
						data-bs-target="#groupModal"
					>
						<b>+</b>
					</button>
				</div>
			</div>
			<Modal show={show} onHide={handleClose}>
				<ModalHeader closeButton>
					<ModalTitle>Create Group</ModalTitle>
				</ModalHeader>
				<ModalBody className="d-flex">
					<input
						placeholder="User, User, User"
						id="groupUsers"
						className="flex-grow-1"
					/>
				</ModalBody>
				<ModalFooter>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button
						variant="primary"
						id="createGrp"
						onClick={handleClose}
					>
						Create
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	)
}

export default withLayout(Groups);
