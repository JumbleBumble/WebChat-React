const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
var passport = require('passport');
var crypto = require('crypto');
var routes = require('./routes');
const cors = require('cors');
const connection = require('./config/database');
const MongoStore = require('connect-mongo')(session);
require('dotenv').config();

var app = express();
app.use(
	cors({
		origin: 'http://localhost:5173', // Replace with your frontend's URL
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
	})
)

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const sessionStore = new MongoStore({ mongooseConnection: connection, collection: 'sessions' });

app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: true,
		store: sessionStore,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24, // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
		},
	})
)

require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    next();
});

// Imports all of the routes from ./routes/index.js
app.use(routes);

// Server listens on http://localhost:3000
app.listen(3000);