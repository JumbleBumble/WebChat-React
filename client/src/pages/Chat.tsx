import withLayout from "../hoc/withLayout";

function Chat() {
    return (
        <div>
            <div className="container">
		<div className="row row-cols-1">
			<div className="col p-3">
				<div className="container">
					<h2 className="d-flex justify-content-center">Connected Users</h2>
					<div className="overflow-auto d-grid gap-2" id="usersList" style={{ maxHeight: '10em' }}>
						
					</div>
				</div>
			</div>
		</div>
		<div className="row p-1">
			<hr />
			<div className="col-6">
			</div>
		</div>
		<div className="row p-1">
			<div className="container d-flex flex-column overflow-auto gap-3"
				 style={{ height: '55vh' }}
				 id="messagesList">

			</div>
		</div>
		<div className="row p-1">
			<div className="container d-flex">
				<input type="text" id="messageInput" className="flex-fill p-1 rounded" />
				<button id="sendButton" className="btn btn-primary rounded ms-2">Send</button>
			</div>
		</div>
	</div>
        </div>
    )
}

export default withLayout(Chat);