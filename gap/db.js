'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dbURI = 'mongodb://localhost:27017/testing';

// Create the database connection
_mongoose2.default.connect(dbURI);

// CONNECTION EVENTS
_mongoose2.default.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + dbURI);
});

_mongoose2.default.connection.on('error', function (err) {
  console.log('Mongoose default connection error: ' + err);
});

_mongoose2.default.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
  _mongoose2.default.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

// BRING IN YOUR SCHEMAS & MODELS // For example
//require('./models/userSchema');