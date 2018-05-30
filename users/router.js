'use strict';
const express = require('express');
const passport = require('passport');
const router = express.Router();
const { Users } = require('./models');

//*** authorization middleware ****
const authCheck = (req, res, next) => {
  (!req.user)?  res.redirect('http://localhost:3000/login'): next();
}


// *** get all users ****
router.get('/allusers', (req, res, next) => {
	Users.find()
		.then( users => res.json( users.map( user => user.serialize() )))
		.catch(next);
});

// *** get current user ***
router.get('/loginuser', authCheck, (req, res, next) => {
	res.json(req.user);
});


module.exports = { router };