'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _users = require('../models/users');

var _users2 = _interopRequireDefault(_users);

var _newResponse = require('../helper/newResponse');

var _newResponse2 = _interopRequireDefault(_newResponse);

var _commonUtil = require('../helper/commonUtil');

var _commonUtil2 = _interopRequireDefault(_commonUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// middleware that is specific to this router
// router.use((req, res, next) => {
//   console.log('Time: ', Date.now());
//   next();
// });

router.get('/', function (req, res) {
  new _users2.default().allUsers(function (err, users) {
    if (err) res.json(new _newResponse2.default(false, 200, null, "Bad Request").Objectify());else res.send(new _newResponse2.default(true, 200, users, "List of all users").Objectify());
  });
});

router.get('/:id', function (req, res) {
  if (new _commonUtil2.default().IsMongoObjectID(req.params.id)) new _users2.default().findUserById(req.params.id, function (err, user) {
    if (err) res.json(new _newResponse2.default(false, 200, null, "No User Found!!").Objectify());else res.send(new _newResponse2.default(true, 200, user[0], "User Found").Objectify());
  });else res.json(new _newResponse2.default(false, 200, null, "No User Found!!").Objectify());
});

module.exports = router;