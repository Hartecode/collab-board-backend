'use strict';
const express = require('express');
const passport = require('passport');
const router = express.Router();
const { Users } = require('./models');
const passportGithub = require('../auth/strategies');


const authCheck = (req, res, next) => {
	(!req.user)?  res.redirect('loginscreen.com'): next();
}

//
router.get('/auth/github', passportGithub.authenticate('github', { scope: [ 'user:email', 'read:user', 'repo:invite' ] }));

router.get('/auth/github/callback',
  passportGithub.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication
    res.redirect('http://localhost:3000/dashboard');
  });

router.get('/allusers', (req, res, next) => {
	Users.find()
		.then( users => res.json( users.map( user => user.serialize() )))
		.catch(next);
});

router.get('/loginuser', authCheck, (req, res, next) => {
	res.json(req.user);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect(' login page');
});

module.exports = { router };