// *** main dependencies *** //
const passport = require('passport');
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = require('../config');;
const GitHubStrategy = require('passport-github2').Strategy;
const { Users } = require('../users/models');



passport.use(
  new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "https://boiling-earth-62792.herokuapp.com/auth/github/callback"
  }, (accessToken, refreshToken, profile, done) => {
    console.log("*******passport callback function fired******")
    let searchQuery = {
      oauthId: profile.id
    };

    let updates = {
      username: profile.username,
      email: profile.emails[0].value,
      oauthId: profile.id,
      avatarUrl: profile['_json'].avatar_url,
      githubProfileUrl: profile.profileUrl,
      githubRepos: profile['_json'].repos_url
    };

    let options = {
      upsert: true
    };

    // update the user if s/he exists or add a new user
    Users.findOneAndUpdate(searchQuery, updates, options, (err, user) => {
      if(err) {
        return done(err);
      } else {
        console.log(`User ${profile.username} added`)
        return done(null, user);
      }
    });
  }

));

// serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  Users.findById(id, (err, user) => {
    done(err, user);
  });
});



module.exports = passport;
