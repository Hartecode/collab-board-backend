'use strick';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  avatarUrl: {
    type: String
  },
  oauthId: {
    type: String,
    required: true,
    select: false
  },
  githubProfileUrl: {
    type: String,
    required: true
  },
  githubRepos: {
    type: String,
    required: true
  }
});

UserSchema.methods.serialize = function() {
  return {
    id: this._id,
    username: this.username || '',
    email: this.email || '',
    avatarUrl: this.avatarUrl || '',
    oauthId: this.oauthId || '',
    githubProfileUrl: this.githubProfileUrl || '',
    githubRepos: this.githubRepos || ''
  };
};

const Users = mongoose.model('Users', UserSchema);

module.exports = { Users };
