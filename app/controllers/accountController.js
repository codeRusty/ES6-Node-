'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _newResponse = require('../helper/newResponse');

var _newResponse2 = _interopRequireDefault(_newResponse);

var _users = require('../models/users');

var _users2 = _interopRequireDefault(_users);

var _config = require('../config/config');

var _config2 = _interopRequireDefault(_config);

var _cryptographer = require('../lib/cryptographer');

var _cryptographer2 = _interopRequireDefault(_cryptographer);

var _mailer = require('../helper/mailer');

var _mailer2 = _interopRequireDefault(_mailer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AccountController = function () {
    function AccountController() {
        _classCallCheck(this, AccountController);
    }
    // Checked


    _createClass(AccountController, [{
        key: 'registerUser',
        value: function registerUser(req, res) {
            var firstName = req.body['firstName'] === undefined ? "" : req.body['firstName'];
            var lastName = req.body['lastName'] === undefined ? "" : req.body['lastName'];
            var password = req.body.password === undefined ? "" : req.body.password;
            var mobile = req.body.mobile === undefined ? "" : req.body.mobile;
            var email = req.body.email === undefined ? "" : req.body.email;

            if (email == "" || password == "") {
                res.json(new _newResponse2.default(false, 200, null, "Invalid Request").Objectify());
            } else {
                var dbUser = new _users2.default();
                dbUser.findUserByEmail(email, function (user) {
                    if (user.length > 0) res.json(new _newResponse2.default(false, 200, null, "Email is already registered").Objectify());else dbUser.registerUser(firstName, lastName, email, mobile, password, function (err, result) {
                        if (err) res.json(new _newResponse2.default(false, 500, err.message, "Server was not able to register the user.").Objectify());else res.json(new _newResponse2.default(true, 200, { "_id": result._id }, "User successfully registered").Objectify());
                    });
                });
            }
        }
        //Checked

    }, {
        key: 'login',
        value: function login(req, res) {
            var email = req.body.email === undefined ? "" : req.body.email;
            var password = req.body.password === undefined ? "" : req.body.password;

            if (email == "" || password == "") {
                res.json(new _newResponse2.default(false, 200, null, "Invalid Request").Objectify());
            } else {
                var dbUser = new _users2.default();
                dbUser.login(email.toLowerCase(), password, function (err, user) {
                    if (err == null && user != null) {
                        var expires = (0, _moment2.default)().add('minute', 1).valueOf();
                        var claims = {
                            sub: user._id,
                            iss: 'https://www.golden.com',
                            permissions: user.role,
                            exp: expires
                        };
                        //iat: Math.floor(Date.now() / 1000) - 30, for token time to begin 30s before
                        var token = _jsonwebtoken2.default.sign(claims, _config2.default.appSecret);
                        user.token = token;
                        user.save(function (e, u) {
                            if (e) res.json(new _newResponse2.default(false, 200, null, "There was a problem. Please try again.").Objectify());else res.json(new _newResponse2.default(true, 200, user, "Login successfull").Objectify());
                        });
                    } else res.send(new _newResponse2.default(false, 200, null, "Invalid Credentials").Objectify());
                });
            }
        }
        //Checked

    }, {
        key: 'changePassword',
        value: function changePassword(req, res) {
            var email = req.body.email === undefined ? "" : req.body.email;
            var oldPass = req.body['oldPassword'] === undefined ? "" : req.body['oldPassword'];
            var newPass = req.body['newPassword'] === undefined ? "" : req.body['newPassword'];
            var confirmPass = req.body['cnfNewPassword'] === undefined ? "" : req.body['cnfNewPassword'];

            if (email != "" && oldPass != "" && newPass != "" && newPass == confirmPass) {
                var dbUser = new _users2.default();
                dbUser.changePassword(email, oldPass, newPass, function (changed) {
                    if (changed) {
                        res.json(new _newResponse2.default(true, 200, { "changed": true }, "The Password has been changed successfully !!").Objectify());
                    } else {
                        res.json(new _newResponse2.default(false, 200, null, "There was an Error changing the Password !!").Objectify());
                    }
                });
            } else {
                res.json(new _newResponse2.default(false, 200, null, "Bad Request").Objectify());
            }
        }
        //Checked

    }, {
        key: 'enableResetPassword',
        value: function enableResetPassword(req, res) {
            var email = req.query.email === undefined ? "" : req.query.email;
            var dbUser = new _users2.default();
            dbUser.findActiveUserByEmail(email, function (dbErr, user) {
                if (dbErr) new _newResponse2.default(false, 200, dbErr, "Some Error");else if (user != null) {
                    var key = new _cryptographer2.default().encrypt(user._id + '||' + user.email + '||' + Date.now());
                    var expDate = (0, _moment2.default)().add('days', 1).valueOf();
                    user.recovery.key = key;
                    user.recovery.exp = expDate;
                    try {
                        user.save(function (e, u) {
                            if (e) res.json(new _newResponse2.default(false, 200, { "mailSent": false }, "Failed to send mil Please Try again").Objectify());else {
                                res.json(new _newResponse2.default(true, 200, { "mailSent": true }, "Mail sent").Objectify());
                                var html = "<a href='http://localhost:3000/recovery?key=" + key + "'>Please click on the link to procced with the process</a>";
                                new _mailer2.default('sourabh.rustagi@daffodilsw.com', email, "Account Recovery", "Please click on the link to procced with the process", html).send();
                            }
                        });
                    } catch (ex) {
                        res.json(new _newResponse2.default(false, 200, { "mailSent": false }, "Failed to send mil Please Try again").Objectify());
                    }
                } else {
                    res.json(new _newResponse2.default(false, 200, { "mailSent": true }, "Mail sent").Objectify());
                    var html = "<a href='http://localhost:3000/recovery?key=" + key + "'>Someone tried to recover your password in from our System. You are not our Registered Customer</a>";
                    new _mailer2.default('sourabh.rustagi@daffodilsw.com', email, "Account Recovery", "Please click on the link to procced with the process", html).send();
                }
            });
        }
        //Checked

    }, {
        key: 'verifyToResetPassword',
        value: function verifyToResetPassword(req, res) {
            var key = req.body.key === undefined ? "" : req.body.key;
            var email = new _cryptographer2.default().decrypt(key).split('||')[1];
            var newPass = req.body['newPassword'] === undefined ? "" : req.body['newPassword'];
            var confirmPass = req.body['cnfNewPassword'] === undefined ? "" : req.body['cnfNewPassword'];
            new _users2.default().verifyResetKey(key, function (perfect) {
                if (perfect) {
                    if (newPass != "" && newPass == confirmPass) {
                        new _users2.default().resetPassword(email, newPass, function (changed) {
                            if (changed) {
                                res.json(new _newResponse2.default(true, 200, { "changed": true }, "The Password has been changed successfully !!").Objectify());
                                // new User().resetKeynExpiry(email);
                            } else {
                                    res.json(new _newResponse2.default(false, 200, null, "There was an Error changing the Password !!").Objectify());
                                }
                        });
                    } else {
                        res.json(new _newResponse2.default(false, 200, null, "No User Matched").Objectify());
                    }
                } else {
                    res.json(new _newResponse2.default(false, 200, null, "Bad Request").Objectify());
                }
            });
        }
    }]);

    return AccountController;
}();

exports.default = AccountController;