'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _userModel = require('../schemas/userModel');

var _userModel2 = _interopRequireDefault(_userModel);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _cryptographer = require('../lib/cryptographer');

var _cryptographer2 = _interopRequireDefault(_cryptographer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ObjID = _mongoose2.default.Types.ObjectId;

var notRequiredInUser = { "modifiedDate": 0, "isDeleted": 0, "password": 0, "isActive": 0 };

var User = function () {
  function User() {
    _classCallCheck(this, User);
  }

  _createClass(User, [{
    key: 'saveUser',
    value: function saveUser(user, cb) {
      _userModel2.default.save(user, function (err, user) {
        cb(err, user);
      });
    }
  }, {
    key: 'allUsers',
    value: function allUsers(cb) {
      _userModel2.default.find({}, notRequiredInUser, function (err, users) {
        cb(err, users);
      });
    }
  }, {
    key: 'login',
    value: function login(email, password, cb) {
      var pass = new _cryptographer2.default().encrypt(password);
      _userModel2.default.findOne({ "email": email, "password": pass, "isActive": true }, { "isDeleted": 0, "password": 0 }, function (err, user) {
        cb(err, user);
      });
    }
  }, {
    key: 'findUserByEmail',
    value: function findUserByEmail(email, cb) {
      _userModel2.default.find({ "email": email }, notRequiredInUser, function (err, users) {
        cb(users);
      });
    }
  }, {
    key: 'findActiveUserByEmail',
    value: function findActiveUserByEmail(email, cb) {
      _userModel2.default.findOne({ "email": email, "isActive": true }, notRequiredInUser, function (err, users) {
        cb(err, users);
      });
    }
  }, {
    key: 'findUserById',
    value: function findUserById(_id, cb) {
      _userModel2.default.findOne({ "_id": new ObjID(_id) }, notRequiredInUser, function (err, users) {
        cb(err, users);
      });
    }
  }, {
    key: 'registerUser',
    value: function registerUser(fname, lname, email, mobile, password, cb) {
      var pass = new _cryptographer2.default().encrypt(password);
      var newUser = new _userModel2.default({
        firstName: fname,
        lastName: lname,
        email: email,
        mobile: mobile,
        password: pass
      });
      newUser.save(function (err, result) {
        cb(err, result);
      });
    }
    // if password change return true

  }, {
    key: 'changePassword',
    value: function changePassword(email, oldPass, newPass, cb) {
      var oldPassword = new _cryptographer2.default().encrypt(oldPass);
      var newPassword = new _cryptographer2.default().encrypt(newPass);
      _userModel2.default.findOne({ "email": email, password: oldPassword }, function (err, user) {
        if (err) cb(false);
        if (user != null) {
          user.password = newPassword;
          user.save();
          cb(true);
        } else {
          cb(false);
        }
      });
    }
  }, {
    key: 'verifyResetKey',
    value: function verifyResetKey(key, cb) {
      var current = new Date();
      _userModel2.default.findOne({ "recovery.key": key, "recovery.exp": { $gt: current } }, function (err, user) {
        console.log(user);
        if (err) cb(false);
        if (user != null) {
          cb(true);
        } else {
          cb(false);
        }
      });
    }
  }, {
    key: 'resetPassword',
    value: function resetPassword(email, newPass, cb) {
      var newPassword = new _cryptographer2.default().encrypt(newPass);
      _userModel2.default.findOne({ "email": email }, function (err, user) {
        if (err) cb(false);
        if (user != null) {
          user.password = newPassword;
          user.recovery.key = "";
          user.save();
          cb(true);
        } else {
          cb(false);
        }
      });
    }
  }, {
    key: 'resetKeynExpiry',
    value: function resetKeynExpiry(email, cb) {
      _userModel2.default.findOne({ "email": email }, function (err, user) {
        if (err) cb(false);
        if (user != null) {
          user.recovery.key = "";
          user.recovery.exp = "";
          user.save();
          cb(true);
        } else {
          cb(false);
        }
      });
    }
  }]);

  return User;
}();

exports.default = User;