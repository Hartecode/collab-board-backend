'use strict';
const express = require('express');
const router = express.Router();
const { Users } = require('./models');
const passportGithub = require('../auth/strategies');


//GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHub will redirect the user
//   back to this application at /auth/github/callback
router.get('/auth/github', passportGithub.authenticate('github', { scope: [ 'user:email', 'read:user', 'repo:invite' ] }));

router.get('/auth/github/callback',
  passportGithub.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication
    res.json(req.user);
  });

router.get('/allusers', (req, res, next) => {
	Users.find()
		.then( users => res.json( users.map( user => user.serialize() )))
		.catch(next);
});

module.exports = { router };