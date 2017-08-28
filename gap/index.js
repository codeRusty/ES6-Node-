'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _nconf = require('nconf');

var _nconf2 = _interopRequireDefault(_nconf);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _swaggerNodeExpress = require('swagger-node-express');

var _swaggerNodeExpress2 = _interopRequireDefault(_swaggerNodeExpress);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

var _auth = require('./lib/auth');

var _auth2 = _interopRequireDefault(_auth);

var _userRoute = require('./routers/userRoute');

var _userRoute2 = _interopRequireDefault(_userRoute);

var _serviceRoute = require('./routers/serviceRoute');

var _serviceRoute2 = _interopRequireDefault(_serviceRoute);

var _accountRoute = require('./routers/accountRoute');

var _accountRoute2 = _interopRequireDefault(_accountRoute);

var _serviceRequestRoute = require('./routers/serviceRequestRoute');

var _serviceRequestRoute2 = _interopRequireDefault(_serviceRequestRoute);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

// for swagger
(0, _minimist2.default)(process.argv.slice(2));
var subpath = (0, _express2.default)();

// parse application/x-www-form-urlencoded
app.use(_bodyParser2.default.urlencoded({ extended: false }));
// parse application/json
app.use(_bodyParser2.default.json());

//for swagger SWAGGER *****************************
app.use("/v1", subpath);
_swaggerNodeExpress2.default.setAppHandler(subpath);
_swaggerNodeExpress2.default.setApiInfo({
    title: "example API",
    description: "API to do something, manage something...",
    termsOfServiceUrl: "",
    contact: "yourname@something.com",
    license: "",
    licenseUrl: ""
});
// Set api-doc path
_swaggerNodeExpress2.default.configureSwaggerPaths('', 'api-docs', '');

// Configure the API domain
var domain = 'localhost';
if (_minimist2.default.domain !== undefined) domain = _minimist2.default.domain;else console.log('No --domain=xxx specified, taking default hostname "localhost".');

// Configure the API port
var port = 1337;
if (_minimist2.default.port !== undefined) port = _minimist2.default.port;else console.log('No --port=xxx specified, taking default port ' + port + '.');

// Set and display the application URL
var applicationUrl = 'http://' + domain + ':' + port;
console.log('snapJob API running on ' + applicationUrl);
_swaggerNodeExpress2.default.configure(applicationUrl, '1.0.0');
//for swagger SWAGGER ****************************************

app.use(_express2.default.static(_path2.default.join(__dirname, 'dist')));
_nconf2.default.argv().env();
// Then load configuration from a designated file.
//nconf.file({ file: './config/dbconfig.json' });
_nconf2.default.defaults({
    'http': {
        'port': 1337
    }
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,token, Content-Type, Accept");
    next();
});
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});

// enable authorisation
app.use('/api', _auth2.default);

app.use('/api/users', _userRoute2.default);
app.use('/api/services', _serviceRoute2.default);
app.use('/accounts', _accountRoute2.default);
app.use('/api/servicerq', _serviceRequestRoute2.default);

app.use(function (err, req, res, next) {
    res.status(500).send('Something broke!');
});

app.listen(_nconf2.default.get('http:port'), function () {
    console.log('Server running on port : ' + _nconf2.default.get('http:port'));
});