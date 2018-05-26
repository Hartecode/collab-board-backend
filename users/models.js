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
  oauthProvider: {
    type: String,
    required: true,
    enum: ['github'],
    select: false
  }
});

UserSchema.methods.serialize = function() {
  return {
    id: this._id,
    username: this.username || '',
    email: this.email || '',
    avatarUrl: this.avatarUrl || '',
    oauthId: this.oauthId || '',
    oauthProvider: this.oauthProvider 
  };
};

const Users = mongoose.model('User', UserSchema);

module.exports = { Users };
