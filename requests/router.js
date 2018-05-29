'use strict';
const express = require('express');
const router = express.Router();

const { Requests } = require('./models');

//*** get owned projects by userId ***
router.get('/:id', (req, res, next) => {
	const id = req.params.id;

	Requests.find( { ownerID: id })
		.then( notifications => res.json(notifications.map( request => request.serialize()))
		.catah(next);
});

//*** delete a project ***
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  
  Requests.findByIdAndRemove(id)
    .then( item => { (item) ? res.status(204).end() : next() })
    .catch(next);
});

module.exports = { router };