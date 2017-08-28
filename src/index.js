import http from 'http';
import express from 'express';
import fs from 'fs';
import nconf from 'nconf';
import bodyParser from 'body-parser';
import argv from 'minimist';
import swagger from "swagger-node-express";
import path from 'path';

import db from './db';
import authenticate from './lib/auth';
import userRoute from './routers/userRoute';
// import serviceRoute from './routers/serviceRoute';
// import accountRoute from './routers/accountRoute';
// import serviceRequestRoute from './routers/serviceRequestRoute';
// import adminRoute from './routers/adminRoute';

var app = express();

// for swagger
argv(process.argv.slice(2));
var subpath = express();

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json 
app.use(bodyParser.json());

//for swagger SWAGGER *****************************
app.use("/v1", subpath);
swagger.setAppHandler(subpath);
swagger.setApiInfo({
    title: "Golden Tender API",
    description: "API to do something, manage something...",
    termsOfServiceUrl: "",
    contact: "yourname@something.com",
    license: "",
    licenseUrl: ""
});
// Set api-doc path
swagger.configureSwaggerPaths('', 'api-docs', '');

// Configure the API domain
var domain = 'localhost';
if (argv.domain !== undefined)
    domain = argv.domain;
else
    console.log('No --domain=xxx specified, taking default hostname "localhost".')

// Configure the API port
var port = 1337;
if (argv.port !== undefined)
    port = argv.port;
else
    console.log('No --port=xxx specified, taking default port ' + port + '.')

// Set and display the application URL
var applicationUrl = 'http://' + domain + ':' + port;
console.log('snapJob API running on ' + applicationUrl);
swagger.configure(applicationUrl, '1.0.0');
//for swagger SWAGGER ****************************************


app.use(express.static(path.join(__dirname, 'dist')));
nconf.argv().env();
// Then load configuration from a designated file.
//nconf.file({ file: './config/dbconfig.json' });
nconf.defaults({
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
//app.use('/api', authenticate);

app.use('/api/users', userRoute);
// app.use('/api/services', serviceRoute);
// app.use('/accounts', accountRoute);
// app.use('/api/servicerq', serviceRequestRoute);
// app.use('/api/admin', adminRoute);

app.use(function (err, req, res, next) {
    res.status(500).send('Something broke!');
});

app.listen(nconf.get('http:port'), () => {
    console.log('Server running on port : ' + nconf.get('http:port'));
});