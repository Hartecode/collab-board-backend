'use strict';
const express = require('express');
const router = express.Router();

const { Requests } = require('./models');

//*** authorization middleware ****
const authCheck = (req, res, next) => {
  (!req.user)?  res.redirect('http://localhost:3000/login'): next();
}

//*** get owned projects by userId ***
router.get('/:userId', (req, res, next) => {
	const userId = req.params.userId;

	Requests.find( { ownerID: userId })
		.then( notifications => res.json(notifications.map( request => request.serialize() )))
		.catch(next);
});

//*** post a new request ****
router.post('/', (req, res, next) => {
	const postRequest = req.body;
	const requiredFeilds = [ 'projectname', 'projectID', 'ownerID', 'requesterID', 'requesterUsername', 'requesterAvatarUrl', 'requestDec'];

	let missingItems = requiredFeilds.filter( field => {
			return !(field in postRequest);
		}
	);

	if (missingItems.length > 0) {
		const err = new Error(`Missing "${missingItems}" in request body`);
		err.status = 400;
		return next(err);
	}

	Requests.create( postRequest )
		.then( newRequest => {
      		res.status(201)
        		.location(`${req.originalUrl}/${newRequest.id}`)
        		.json(newRequest.serialize());
  		})
    	.catch(next);
});

//*** delete a project ***
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  
  Requests.findByIdAndRemove(id)
    .then( item => { (item) ? res.status(204).end() : next() })
    .catch(next);
});

module.exports = { router };