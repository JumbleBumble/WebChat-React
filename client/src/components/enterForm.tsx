import React, { useEffect, useState } from 'react'


interface ComponentProps {
	title: string
	formHandler: () => Promise<void>
	inputHandler: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function EnterForm({ title, formHandler, inputHandler }: ComponentProps) {
	return (
		<div className="d-flex align-items-center">
			<div
				className="container p-2 d-flex flex-column align-items-center justify-content-evenly gap-3"
				style={{ minHeight: '55vh' }}
			>
				<h2 className="">{title}</h2>
				<input
					className="rounded border-1 input-solid w-25"
					type="text"
					name="user"
					onChange={inputHandler}
					placeholder="Username"
				/>
				<input
					className="rounded border-1 input-solid w-25"
					type="password"
					name="pw"
					onChange={inputHandler}
					placeholder="Password"
				/>
				<button className="btn btn-primary" onClick={formHandler}>
					{title}
				</button>
			</div>
		</div>
	)

}

export default EnterForm
