const router = require('express').Router();
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const connection = require('../config/database');
const User = connection.models.User;
const isAuth = require('./authMiddleware').isAuth;
const isAdmin = require('./authMiddleware').isAdmin;

/**
 * -------------- POST----------------
 */

 router.post('/api/login',passport.authenticate('local'),(req, res, next) => {
	res.status(200).send();
 })
 


 router.post('/api/logout', (req, res, next) => {
		req.logout()
		res.status(200).send()
 })

 router.post('/api/register', (req, res, next) => {
		const saltHash = genPassword(req.body.pw)

		const salt = saltHash.salt
		const hash = saltHash.hash

		const newUser = new User({
			username: req.body.user,
			hash: hash,
			salt: salt,
			admin: true,
		})

		newUser.save()
		//res.redirect('/api/login')
		res.status(200).send();
 })


 /**
 * -------------- GET----------------
 */


router.get('/api/check-auth', isAuth, (req, res, next) => {
    const user = req.user.username;
    res.status(200).json({ user })
})

router.get('/api/admin-route', isAdmin, (req, res, next) => {
	res.send('You made it to the admin route.')
})

// Visiting this route logs the user out
router.get('/api/logout', (req, res, next) => {
	req.logout()
	res.status(200).send()
})

router.get('/api/login-failure', (req, res, next) => {
	res.send('You entered the wrong password.')
})

module.exports = router;