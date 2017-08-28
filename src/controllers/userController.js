import jwt from 'jsonwebtoken';
import moment from 'moment'

import config from '../config/config';
import Cryptographer from '../lib/cryptographer';
import Mailer from '../helper/mailer';

import NResponse from '../helper/newResponse';
import User from '../models/users';

export default class UserController {
    constructor() {

    }

    getAllUsers(req, res) {
        User().allUsers((err, users) => {
            if (err)
                res.json(new NResponse(false, 200, null, "Bad Request").Objectify());
            else
                res.send(new NResponse(true, 200, users, "List of all users").Objectify())
        });
    }


}