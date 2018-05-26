'use strick';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const RequestSchema = mongoose.Schema({
  projectname: {
    type: String,
    required: true
  },
  projectID: {
    type: String,
    required: true
  },
  ownerID: {
    type: String,
    require: true
  },
  requesterID: {
    type: String,
    require: true
  },
  requesterAvatarUrl: {
    type: String,
    require: true
  },
  requestDec: {
    type: String,
    require: true
  },
  status : {
    type: String,
    default: 'Pending'
  }
});

RequestSchema.methods.serialize = function() {
  return {
    id: this._id,
    projectname: this.projectname || '',
    projectID: this.projectID || '',
    ownerID: this.ownerID || '',
    requesterID: this.requesterID || '',
    requesterAvatarUrl: this.requesterAvatarUrl || '',
    requestDec: this.requestDec || '',
    status: this.status
  };
};

const Requests = mongoose.model('Requests', RequestSchema);

module.exports = { Requests };
