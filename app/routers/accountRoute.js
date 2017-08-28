'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _accountController = require('../controllers/accountController');

var _accountController2 = _interopRequireDefault(_accountController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nodemailer = require('nodemailer');
var router = _express2.default.Router();

// middleware that is specific to this router
router.use(function (req, res, next) {
  //console.log('/Accounts  : :  ', req.body);
  next();
});

router.post('/Registers', new _accountController2.default().registerUser);

router.post('/logins', new _accountController2.default().login);

router.post('/ChangePassword', new _accountController2.default().changePassword);

router.get('/Recovery', new _accountController2.default().enableResetPassword);

router.post('/Reset', new _accountController2.default().verifyToResetPassword);

module.exports = router;