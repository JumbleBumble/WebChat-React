const router = require('express').Router()
const isAuth = require('./authMiddleware').isAuth
const isAdmin = require('./authMiddleware').isAdmin
const User = require('../models/User')
const Group = require('../models/group')

/**
 * -------------- POST ----------------
 */

router.post('/api/group/create', isAuth, async (req, res, next) => {
	const users = req.body.users
	try {
		if (users && users.length > 0) {
			const groupExists = await Group.exists({ users: users })
			if (!groupExists) {
				const newGroup = new Group({
					users: users,
				})
				newGroup.save()
				res.status(200).send('Group successfully created')
				return
			}
			res.status(400).send('Group already exists')
			return
		}
		res.status(400).send('Users not found')
	} catch (error) {
		console.error(error)
		res.status(500).send('Internal Server Error')
	}
})

router.post('/api/group/update/:id', isAuth, async (req, res, next) => {
	const groupId = req.params.id
	const users = req.body.users
	const username = req.user.username

	try {
		const isMember = await Group.exists({ _id: groupId, users: username })

		if (isMember) {
			if (users && users.length > 0) {
				const updatedGroup = await Group.findByIdAndUpdate(
					groupId,
					{ users: users },
					{ new: true }
				)

				if (updatedGroup) {
					res.status(200).send('Group successfully updated')
				} else {
					res.status(404).send('Group not found')
				}
			} else {
				res.status(400).send('Users not found')
			}
		} else {
			res.status(403).send(
				'You are not a member of this group or group does not exist'
			)
		}
	} catch (error) {
		console.error(error)
		res.status(500).send('Internal Server Error')
	}
})

/**
 * -------------- GET ----------------
 */

router.get('/api/group/user', isAuth, async (req, res, next) => {
	const username = req.user.username

	try {
		const userGroups = await Group.find({ users: username })

		res.status(200).json(userGroups)
	} catch (error) {
		console.error(error)
		res.status(500).send('Internal Server Error')
	}
})

/**
 * -------------- DELETE ----------------
 */

router.delete('/api/group/delete/:id', isAuth, async (req, res, next) => {
	const username = req.user.username
	const groupId = req.params.id

	try {
		const isMember = await Group.exists({ _id: groupId, users: username })

		if (isMember) {
			const members = await Group.findById(groupId)
				.select('users')
				.lean()
			if (members && members.users && members.users.length <= 1) {
				const deletedGroup = await Group.findByIdAndRemove(groupId)

				if (deletedGroup) {
					res.status(200).send('Group successfully deleted')
				} else {
					res.status(404).send('Group not found')
				}
			} else {
				members.pop(username)
				const updatedGroup = await Group.findByIdAndUpdate(
					groupId,
					{ users: members },
					{ new: true }
				)
				if (updatedGroup) {
					res.status(200).send('Group successfully left')
				} else {
					res.status(404).send('Group not found')
				}
			}
		} else {
			res.status(403).send(
				'You are not a member of this group or group does not exist'
			)
		}
	} catch (error) {
		console.error(error)
		res.status(500).send('Internal Server Error')
	}
})

module.exports = router
