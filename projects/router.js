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
router.get('/:projectId', (req, res, next) => {
	const projectId = req.params.projectId;

	Projects.findById(projectId)
		.then( project => (project)? res.json(project.serialize()) : next())
		.catch(next);
});

	
//*** get owned projects by userId ***
router.get('/own/:userId', (req, res, next) => {
	const userId = req.params.userId;
	Projects.find( { ownerID: userId})
		.then( projects => res.json(projects.map(project => project.serialize() )))
		.catch(next);
});

//*** get collab projects by userId ***
router.get('/collab/:userId', (req, res, next) => {
	const userId = req.params.userId;
	Projects.find(  { "collaborators.userID": userId })
		.then( projects => res.json( projects.map(project => project.serialize() )))
		.catch(next);
});

//*** add a new project ***
router.post('/', (req, res, next) => {
	const postProject = req.body;
	const requiredFeilds = [ 'projectname', 'projectDec', 'projectLink', 'projectSeeking', 'ownerID', 'ownerAvatarUrl'];

	let missingItems = requiredFeilds.filter( field => {
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

	let missingItems = requiredFeilds.filter( field => {
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

// *** add pending request ***
router.post('/pending/:projectId', (req, res, next) => {
	const projectId = req.params.projectId;
	const requester = req.body;

	const requiredFeilds = ['userID'];

	let missingItems = requiredFeilds.filter( field => {
			return !(field in requester);
		}
	);

	if (missingItems.length > 0) {
		const err = new Error(`Missing "${missingItems}" in request body`);
		err.status = 400;
		return next(err);
	}

	Projects.findById(projectId)
		.then( project => {
			project.pendingRequest.push(requester);

			project.save( err => {
				(err) ? res.send(err): res.json(requester)
			});
		})
		.catch(next);
	
});

// *** add collab ***
router.post('/collab/:projectId', (req, res, next) => {
	const projectId = req.params.projectId;
	const collaborator = req.body;

	const requiredFeilds = ['userID', 'avatarUrl'];

	let missingItems = requiredFeilds.filter( field => {
			return !(field in collaborator);
		}
	);

	if (missingItems.length > 0) {
		const err = new Error(`Missing "${missingItems}" in request body`);
		err.status = 400;
		return next(err);
	}

	Projects.findById(projectId)
		.then( project => {
			project.collaborators.push(collaborator);

			project.save( err => {
				(err) ? res.send(err): res.json(collaborator);
			})
		})
		.catch(next);
});

// *** delete preding request ***
router.delete('/removerequest/:projectId/:requestId', (req, res, next) => {
	const projectId = req.parmas.projectId;
	const requestId = req.parmas.requestId;

	Projects.findById(projectId)
		.then( project => {
			project.pendingRequest.id(requesterID).remove();

			project.save( err => {
				(err) ? res.send(err): res.json(project)
			});
		})
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