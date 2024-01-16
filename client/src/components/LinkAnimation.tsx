import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

function HoverAnimation() {
	const { contextSafe } = useGSAP()

	const onEnter = (event: React.MouseEvent<HTMLDivElement>): void => {
		contextSafe(() => {
			gsap.to(event.currentTarget, { scale: '1.2' })
		})()
	}

	const onClick = (event: React.MouseEvent<HTMLDivElement>): void => {
		contextSafe(() => {
			gsap.to(event.currentTarget, { rotate: '+=360' })
		})()
	}

	const onLeave = (event: React.MouseEvent<HTMLDivElement>): void => {
		contextSafe(() => {
			gsap.to(event.currentTarget, { scale: '1' })
		})()
	}

	return (
		<h2 className="text-light p-4 d-flex flex-row">
			Made by
			<div
				className="ms-3"
				onMouseEnter={onEnter}
				onMouseLeave={onLeave}
				onClick={onClick}
				onAuxClick={onClick}
			>
				<a
					className="text-decoration-none"
					href="https://github.com/JumbleBumble"
				>
					Jumble
				</a>
			</div>
		</h2>
	)
}

export default HoverAnimation
