'use strict';

//connects to the database 
exports.DATABASE_URL =  'mongodb://localhost/collab-board' || process.env.DATABASE_URL || global.DATABASE_URL;

// //connects to the testing database
exports.TEST_DATABASE_URL = 
	process.env.TEST_DATABASE_URL || 
	'mongodb://localhost/test-collab-board';

exports.PORT = 8080 || process.env.PORT  ;
