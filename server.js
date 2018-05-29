'use strict';

// *** main dependencies *** //
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

mongoose.Promise = global.Promise;

//bring over Port & DATABASE_URL from config.js
const { PORT, DATABASE_URL } = require('./config')

// *** routes *** 
const { router: usersRouter } = require('./users');
const { router: projectsRouter } = require('./projects');
const { router: requestRouter } = require('./projects');

// *** express instance *** 
const app = express();

// // CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

///set up cookie 
app.use(cookieSession({
  name: 'session',
  keys: ['secretKeyIsAStringAndShouldBeHidden'],
 
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

//*** middleware ***
app.use(morgan('common'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());


// *** routers ***

// app.use('/api', usersRouter);
app.use('/api/users', usersRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/requests', requestRouter);


//test to see if server is running
app.get('/', (req, res) => {
	res.send("testing");
});

//if not the any useable end point then display a message
app.use('*', function (req, res) {
  res.status(404).json({ message: 'Page Not Found' });
});


//the variable server is blank but will be assigned under runServer and will be used again in closerserver
let server;

// *** run server ***
function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// *** close server ***
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}


module.exports = { app, runServer, closeServer };