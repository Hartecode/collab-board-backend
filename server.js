console.log('test');
const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const GitHubStrategy = require('passport-github2').Strategy;

const {User} = require('./users/models');

const app = express();

// Logging
app.use(morgan('common'));

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHub will redirect the user
//   back to this application at /auth/github/callback
app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }),
  function(req, res, next){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  });

// GET /auth/github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res, next) {
    res.redirect('/');
    console.log(req)
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// app.get("/auth/github", function(req, res){
//   console.log("started oauth");
//   return githubOAuth.login(req, res);
// });

// app.get("/auth/github/callback", function(req, res){
//   console.log("received callback");
//   return githubOAuth.callback(req, res);
// });

// githubOAuth.on('error', function(err) {
//   console.error('there was a login error', err)
// })

// githubOAuth.on('token', function(token, serverResponse) {
//   serverResponse.end(JSON.stringify(token))
// })

app.get('/', (req, res) => {
	res.send("testing");
});

app.listen(8000, () => console.log('server running port 8000'));