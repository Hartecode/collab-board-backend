'use strict';
const express = require('express');
const passport = require('passport');
const router = express.Router();
const { Users } = require('../users/models');
const passportGithub = require('./strategies');

//**** github initial login link 
router.get('/github', passportGithub.authenticate('github', { scope: [ 'user:email', 'read:user', 'repo:invite' ] }));


///**** github callback router *****
router.get('/github/callback',
  passportGithub.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication
    console.log(`${req.user.username} login to the app`);
    res.redirect('http://localhost:3000/dashboard');
  }
);


///*** logout end point ****
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('http://localhost:3000/login');
});

module.exports = { router };