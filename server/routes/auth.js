const router = require('express').Router()
const passport = require('passport')
const genPassword = require('../lib/passwordUtils').genPassword
const User = require('../models/User')
const isAuth = require('./authMiddleware').isAuth
const isAdmin = require('./authMiddleware').isAdmin
require('dotenv').config()

/**
 * -------------- POST ----------------
 */

router.post('/api/login', passport.authenticate('local'), (req, res, next) => {
	res.status(200).send()
})

router.post('/api/logout', (req, res, next) => {
	req.logout()
	res.status(200).send()
})

router.post('/api/register', async (req, res, next) => {
	if (req.body.pw.length < 1 || req.body.user.length < 1) {
		return res
			.status(400)
			.send('Username and Password must be longer than 1 character.')
	}

	const exists = await User.exists({ username: req.body.user })

	if (exists) {
		return res.status(409).send('This username is not available')
	}

	if (
		process.env.MIN_PASS_LENGTH &&
		parseInt(process.env.MIN_PASS_LENGTH) > 0
	) {
		const minPass = parseInt(process.env.MIN_PASS_LENGTH)
		const pwLen = req.body.pw.length
		if (pwLen < minPass) {
			return res
				.status(412)
				.send(
					`Minimum password length is ${minPass}. Please add at least ${
						minPass - pwLen
					} characters to your password.`
				)
		}
	}

	const saltHash = genPassword(req.body.pw)

	const salt = saltHash.salt
	const hash = saltHash.hash

	const newUser = new User({
		username: req.body.user,
		hash: hash,
		salt: salt,
		admin: true,
	})

	newUser.save().then(() => {
		res.status(200).send()
	})
})

/**
 * -------------- GET ----------------
 */

router.get('/api/check-auth', isAuth, (req, res, next) => {
	const user = req.user.username
	res.status(200).json({ user })
})

router.get('/api/admin', isAdmin, (req, res, next) => {
	//placeholder
})

router.get('/api/logout', (req, res, next) => {
	req.logout()
	res.status(200).send()
})

module.exports = router
