'use strict';
const express = require('express');
const router = express.Router();

const { Projects } = require('./models');

//*** authorization middleware ****
const authCheck = (req, res, next) => {
  (!req.user)?  res.redirect('http://localhost:3000/login'): next();
}

//*** get All projects ***
router.get('/', (req, res, next) => {
	Projects.find()
		.then(projects => res.json(projects.map(project => project.serialize())))
		.catch(next);
});

//*** get project by the project's id ***
router.get('/:id', (req, res, next) => {
	const id = req.params.id;
	Projects.findById(id)
		.then( project => (project)? res.json(project.serialize()) : next())
		.catah(next);
});

//*** get owned projects by userId ***
router.get('/own/:id', (req, res, next) => {
	const id = req.params.id;
	Projects.find( { ownerID: id })
		.then( projects => res.json(projects.map(project => project.serialize() )))
		.catah(next);
});

//*** get collab projects by userId ***
router.get('/collab/:id', (req, res, next) => {
	const id = req.params.id;
	Projects.find( { collaborators: [
			{
				userID: id
			}
		] })
		.then( projects => res.json( project => project.serialize()))
		.catah(next);
});

//*** add a new project ***
router.post('/', (req, res, next) => {
	const postProject = req.body;
	const requiredFields = [ 'projectname', 'projectDec', 'projectLink', 'ownerID', 'ownerAvatarUrl'];

	let missingItems = requiredFeilds.map( field => {
			return !(field in postProject);
		}
	);

	if (missingItems.length > 0) {
		const err = new Error(`Missing "${missingItems}" in request body`);
		err.status = 400;
		return next(err);
	}

	Projects.create( postProject )
		.then( newProject => {
      		res.status(201)
        		.location(`${req.originalUrl}/${newProject.id}`)
        		.json(newProject.serialize());
  		})
    	.catch(next);
});

//*** update the project ***
router.put('/:id', (req, res, next) => {
	const id = req.parmas.id;
	const updates = req.body;
	const updateableField = ['projectname', 'projectDec'];

	let missingItems = requiredFeilds.map( field => {
			return !(field in postProject);
		}
	);

	if (missingItems.length > 0) {
		const err = new Error(`Missing "${missingItems}" in request body`);
		err.status = 400;
		return next(err);
	}

	Projects.findByIdAndUpdate(id, updates, { new: true })
		.then( item => { (item) ? res.json(item.serialize()) : next() })
		.catch(next);
});

//*** delete a project ***
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  
  Porjects.findByIdAndRemove(id)
    .then( item => { (item) ? res.status(204).end() : next() })
    .catch(next);
});

module.exports = { router };