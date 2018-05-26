'use strick';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const ProjectSchema = mongoose.Schema({
  projectname: {
    type: String,
    required: true
  },
  projectDec: {
    type: String,
    required: true
  },
  projectLink: {
    type: String,
    require: true
  },
  ownerID: {
    type: String,
    require: true
  },
  ownerAvatarUrl: {
    type: String,
    require: true
  },
  collaborators: [
    {
      userID: {
        type: String,
        require: true
      },
      avatarUrl: {
        type: String,
        require: true
      }
    }
  ],
  pendingRequest: [
        String
  ]
});

ProjectSchema.methods.serialize = function() {
  return {
    id: this._id,
    projectname: this.projectname || '',
    projectDec: this.projectDec || '',
    projectLink: this.projectLink || '',
    ownerID: this.ownerId || '',
    ownerAvatarUrl: this.ownerAvatarUrl || '',
    collaborators: this.collaborators,
    pendingRequest: this.pendingRequest
  };
};

const Projects = mongoose.model('Projects', ProjectSchema);

module.exports = { Projects };
