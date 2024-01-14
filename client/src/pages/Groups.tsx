import axios from 'axios'
import withLayout from '../hoc/withLayout'
import { useEffect, useState } from 'react'
import {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import AlertDismissible from '../components/AlertDismissible'
import { Link } from 'react-router-dom'

function Groups() {
	const apiUrl = import.meta.env.VITE_REACT_APP_API_URL
	const [show, setShow] = useState<boolean>(false)
	const [groupInput, setGroupInput] = useState<string>('')
	const [alert, setAlert] = useState<JSX.Element>(<></>)
	const [groups, setGroups] = useState<
		Record<string, UserContainerProps> | undefined
	>()

	const handleClose = () => setShow(false)
	const handleShow = () => setShow(true)

	useEffect(() => {
		const fetchUserGroups = async () => {
			try {
				const response = await axios.get(apiUrl + 'group/user', {
					withCredentials: true,
				})

				if (response.data) {
					setGroups(response.data)
				}
			} catch (error) {
				console.error('Error getting user groups', error)
			}
		}

		fetchUserGroups()
	}, [])

	async function CreateGroup(): Promise<void> {
		try {
			const users: string[] = groupInput.split(',')
			await axios.post(
				apiUrl + 'group/create',
				{ users: users },
				{
					withCredentials: true,
				}
			)
		} catch (error) {
			setAlert(
				<AlertDismissible
					key={new Date().getTime()}
					title="Failed to create group"
					body="There was a problem when creating the group. Possible duplicate?"
					variant="danger"
					isShow={true}
				/>
			)
			console.error('Error creating group:', error)
		}
		setShow(false)
	}

	interface UserContainerProps {
		users: string[]
	}

	const UserContainer: React.FC<UserContainerProps> = ({ users }) => (
		<div>
			{users.map((user, index) => (
				<div
					key={index}
					className="avatar me-2 mt-1 shadow-sm rounded-pill text-center p-1 bg-light"
				>
					{user}
				</div>
			))}
		</div>
	)

	interface GroupContainerProps {
		data: Record<string, UserContainerProps>
	}

	const GroupContainer: React.FC<GroupContainerProps> = ({ data }) => (
		<div>
			{Object.entries(data).map(([ikey, item], index) => (
				<div
					key={index}
					className="list-group list-group-flush border rounded-3 overflow-hidden mb-3"
				>
					<div className="list-group-item list-group-item-action rounded-3 p-3">
						<div className="position-absolute top-0 end-0 d-flex justify-content-end p-1">
							<button
								id="del @group.Id"
								className="btn btn-danger btn-sm"
							>
								X
							</button>
						</div>
						<div className="d-flex align-items-center">
							<div>
								<div className="container d-flex flex-wrap">
									<UserContainer users={item.users} />
								</div>
							</div>
						</div>
						<div className="d-flex justify-content-center">
							<Link
								to={`/chat/${ikey}`}
								className="btn btn-primary btn-lg p-1"
							>
								Open
							</Link>
						</div>
					</div>
				</div>
			))}
		</div>
	)

	return (
		<div style={{ marginBottom: '69.67vh' }}>
			{alert}
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
				{groups && (
					<div
						className="card-body overflow-auto position-relative d-grid gap-3"
						style={{ maxHeight: '70vh' }}
					>
						<GroupContainer data={groups} />
					</div>
				)}
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
						value={groupInput}
						onChange={(e) => setGroupInput(e.target.value)}
					/>
				</ModalBody>
				<ModalFooter>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button
						variant="primary"
						id="createGrp"
						onClick={CreateGroup}
					>
						Create
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	)
}

export default withLayout(Groups)
