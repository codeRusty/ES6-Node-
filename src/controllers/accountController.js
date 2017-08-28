import jwt from  'jsonwebtoken';
import moment from 'moment'

import NResponse from '../helper/newResponse';
import User from '../models/users';
import config from '../config/config';
import Cryptographer from '../lib/cryptographer';
import Mailer from '../helper/mailer';

export default class AccountController {
    constructor() {

    }
    // Checked
    registerUser(req, res) {
        let firstName = (req.body['firstName'] === undefined) ? "" : req.body['firstName'];
        let lastName = (req.body['lastName'] === undefined) ? "" : req.body['lastName'];
        let password = (req.body.password === undefined) ? "" : req.body.password;
        let mobile = (req.body.mobile === undefined) ? "" : req.body.mobile;
        let email = (req.body.email === undefined) ? "" : req.body.email;
        console.log(req.body);
        if (email == "" || password == "") {
            res.json(new NResponse(false, 200, null, "Invalid Request").Objectify());
        }
        else {
            var dbUser = new User();
            dbUser.findUserByEmail(email, (user) => {
                if (user.length > 0)
                    res.json(new NResponse(false, 200, null, "Email is already registered").Objectify());
                else
                    dbUser.registerUser(firstName, lastName, email, mobile, password, (err, result) => {
                        if (err)
                            res.json(new NResponse(false, 500, err.message, "Server was not able to register the user.").Objectify());
                        else
                            res.json(new NResponse(true, 200, { "_id": result._id }, "User successfully registered").Objectify());
                    });
            });
        }
    }
    //Checked
    login(req, res) {
        let email = (req.body.email === undefined) ? "" : req.body.email;
        let password = (req.body.password === undefined) ? "" : req.body.password;
        console.log(req.body);
        if (email == "" || password == "") {
            res.json(new NResponse(false, 200, null, "Invalid Request").Objectify());
        }
        else {
            var dbUser = new User();
            dbUser.login(email.toLowerCase(), password, (err, user) => {
                if (err == null && user != null) {
                    var expires = moment().add('minute', 1).valueOf();
                    let claims = {
                        sub: user._id,
                        iss: 'https://www.golden.com',
                        permissions: user.role,
                        exp: expires
                    }
                    //iat: Math.floor(Date.now() / 1000) - 30, for token time to begin 30s before
                    let token = jwt.sign(claims, config.appSecret);
                    user.token = token;
                    user.save((e, u) => {
                        console.log(u);
                        if (e)
                            res.json(new NResponse(false, 200, null, "There was a problem. Please try again.").Objectify());
                        else
                            res.json(new NResponse(true, 200, user, "Login successfull").Objectify());
                    });
                }
                else
                    res.send(new NResponse(false, 200, null, "Invalid Credentials").Objectify());
            });
        }
    }
    //Checked
    changePassword(req, res) {
        let email = (req.body.email === undefined) ? "" : req.body.email;
        let oldPass = (req.body['oldPassword'] === undefined) ? "" : req.body['oldPassword'];
        let newPass = (req.body['newPassword'] === undefined) ? "" : req.body['newPassword'];
        let confirmPass = (req.body['cnfNewPassword'] === undefined) ? "" : req.body['cnfNewPassword'];

        if (email != "" && oldPass != "" && newPass != "" && newPass == confirmPass) {
            var dbUser = new User();
            dbUser.changePassword(email, oldPass, newPass, (changed) => {
                if (changed) {
                    res.json(new NResponse(true, 200, { "changed": true }, "The Password has been changed successfully !!").Objectify());
                }
                else {
                    res.json(new NResponse(false, 200, null, "There was an Error changing the Password !!").Objectify());
                }
            });
        }
        else {
            res.json(new NResponse(false, 200, null, "Bad Request").Objectify());
        }

    }
    //Checked
    enableResetPassword(req, res) {
        let email = (req.query.email === undefined) ? "" : req.query.email;
        if (email != "") {
            var dbUser = new User();
            dbUser.findActiveUserByEmail(email, (dbErr, user) => {
                if (dbErr)
                    new NResponse(false, 200, dbErr, "Some Error");
                else if (user != null) {
                    var key = new Cryptographer().encrypt(user._id + '||' + user.email + '||' + Date.now());
                    var expDate = moment().add(1, 'days').valueOf();
                    user.recovery.key = key;
                    user.recovery.exp = expDate;
                    try {
                        user.save((e, u) => {
                            if (e)
                                res.json(new NResponse(false, 200, { "mailSent": false }, "Failed to send mil Please Try again").Objectify());
                            else {
                                res.json(new NResponse(true, 200, { "mailSent": true }, "Mail sent").Objectify());
                                let html = "<a href='http://172.18.0.40:4200/recovery?key=" + key + "'>Please click on the link to procced with the process</a>";
                                new Mailer('sourabh.rustagi@daffodilsw.com', email, "Account Recovery", "Please click on the link to procced with the process", html).send();
                            }
                        });

                    }
                    catch (ex) {
                        res.json(new NResponse(false, 200, { "mailSent": false }, "Failed to send mil Please Try again").Objectify());
                    }
                }
                else {
                    res.json(new NResponse(false, 200, null, "Your Email is not registered with us.").Objectify());
                    //let html = "<a href='http://172.18.1.40:4200/fraud?key=" + 133 + "'>Someone tried to recover your password in from our System. You are not our Registered Customer</a>";
                    //new Mailer('sourabh.rustagi@daffodilsw.com', email, "Account Recovery", "Please click on the link to procced with the process", html).send();
                }
            });
        }
    }
    //Checked
    verifyToResetPassword(req, res) {
        let key = (req.body.key === undefined) ? "" : req.body.key;
        let email = new Cryptographer().decrypt(key).split('||')[1];
        let newPass = (req.body['newPassword'] === undefined) ? "" : req.body['newPassword'];
        let confirmPass = (req.body['cnfNewPassword'] === undefined) ? "" : req.body['cnfNewPassword'];
        new User().verifyResetKey(key, (perfect) => {
            if (perfect)
                if (newPass != "" && newPass == confirmPass) {
                    new User().resetPassword(email, newPass, (changed) => {
                        if (changed) {
                            res.json(new NResponse(true, 200, { "changed": true }, "The Password has been changed successfully !!").Objectify());
                            // new User().resetKeynExpiry(email);
                        }
                        else {
                            res.json(new NResponse(false, 200, null, "There was an Error changing the Password !!").Objectify());
                        }
                    });
                }
                else {
                    res.json(new NResponse(false, 200, null, "No User Matched").Objectify());
                }
            else {
                res.json(new NResponse(false, 200, null, "Bad Request").Objectify());
            }
        });

    }
}