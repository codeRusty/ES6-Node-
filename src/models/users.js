import userModel from '../schemas/userModel';
import mongoose  from 'mongoose'
import Crypt from '../lib/cryptographer'
var ObjID = mongoose.Types.ObjectId;

var notRequiredInUser = { "token": 0, "recovery": 0, "modifiedDate": 0, "isDeleted": 0, "password": 0, "isActive": 0 }

export default class User {

  constructor() {
  }
  saveUser(user, cb) {
    userModel.save(user, (err, user) => { cb(err, user) });
  }

  allUsers(cb) {
    userModel.find({ "isActive": true }, notRequiredInUser, (err, users) => {
      cb(err, users);
    });
  }

  login(email, password, cb) {
    var pass = new Crypt().encrypt(password);
    userModel.findOne({ "email": email, "password": pass, "isActive": true }, { "isDeleted": 0, "password": 0 }, (err, user) => {
      cb(err, user);
    });
  }

  findUserByEmail(email, cb) {
    userModel.find({ "email": email }, notRequiredInUser, (err, users) => {
      cb(users);
    });
  }
  findActiveUserByEmail(email, cb) {
    userModel.findOne({ "email": email, "isActive": true }, notRequiredInUser, (err, users) => {
      cb(err, users);
    });
  }

  findUserById(_id, cb) {
    userModel.findOne({ "_id": new ObjID(_id) }, notRequiredInUser, (err, user) => {
      cb(err, user);
    });
  }

  deavtivateUser(_id, cb) {
    userModel.findOne({ "_id": new ObjID(_id) }, function (err, user) {
      if (user != null) {
        user.isActive = false;
        user.modifiedDate = new Date();
        user.save((err, result) => {
          cb(err, result);
        });
      }
      else {
        cb(err, user);
      }
    });
  }

  registerUser(fname, lname, email, mobile, password, cb) {
    let pass = new Crypt().encrypt(password);
    var newUser = new userModel({
      firstName: fname,
      lastName: lname,
      email: email,
      mobile: mobile,
      password: pass
    });
    newUser.save((err, result) => {
      cb(err, result);
    });
  }
  // if password change return true
  changePassword(email, oldPass, newPass, cb) {
    let oldPassword = new Crypt().encrypt(oldPass);
    let newPassword = new Crypt().encrypt(newPass);
    userModel.findOne({ "email": email, password: oldPassword }, (err, user) => {
      if (err)
        cb(false);
      if (user != null) {
        user.password = newPassword;
        user.save();
        cb(true);
      }
      else {
        cb(false);
      }
    });
  }


  verifyResetKey(key, cb) {
    let current = new Date();
    userModel.findOne({ "recovery.key": key, "recovery.exp": { $gt: current } }, (err, user) => {
      console.log(user);
      if (err)
        cb(false);
      if (user != null) {
        cb(true);
      }
      else {
        cb(false);
      }
    });
  }

  resetPassword(email, newPass, cb) {
    let newPassword = new Crypt().encrypt(newPass);
    userModel.findOne({ "email": email }, (err, user) => {
      if (err)
        cb(false);
      if (user != null) {
        user.password = newPassword;
        user.recovery.key = "";
        user.save();
        cb(true);
      }
      else {
        cb(false);
      }
    });
  }

  resetKeynExpiry(email, cb) {
    userModel.findOne({ "email": email }, (err, user) => {
      if (err)
        cb(false);
      if (user != null) {
        user.recovery.key = "";
        user.recovery.exp = "";
        user.save();
        cb(true);
      }
      else {
        cb(false);
      }
    });
  }


}