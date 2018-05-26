// *** main dependencies *** //
const passport = require('passport');
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GitHubStrategy = require('passport-github2').Strategy;
const { Users } = require('../users/models');



passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {

    let searchQuery = {
      name: profile.displayName
    };

    let updates = {
      name: profile.displayName,
      someID: profile.id
    };

    let options = {
      upsert: true
    };

    // update the user if s/he exists or add a new user
    Users.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
      if(err) {
        return done(err);
      } else {
        return done(null, user);
      }
    });
  }

));

// serialize user into the session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Users.findById(id, function (err, user) {
    done(err, user);
  });
});


module.exports = passport;
