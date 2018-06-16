'use strict';
exports.GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "f84675d1-22c2-4508-9864-c61f3d591ef8";
exports.GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET ||	"85fc6d0c2195ca7b7e18f33eae14f8858a2074d89c1420992361b89a575a74a2";

//connects to the database 
exports.DATABASE_URL =  process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://localhost/collab-board'  ;

// //connects to the testing database
exports.TEST_DATABASE_URL = 
	process.env.TEST_DATABASE_URL || 
	'mongodb://localhost/test-collab-board';

exports.PORT = process.env.PORT || 8080;
