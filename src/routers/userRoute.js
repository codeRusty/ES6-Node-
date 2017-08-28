import express from 'express';
import User from '../models/users';
import NResponse from '../helper/newResponse';
import CommonUtil from '../helper/commonUtil';

import UserController from '../controllers/UserController'
var router = express.Router();

// middleware that is specific to this router
// router.use((req, res, next) => {
//   console.log('Time: ', Date.now());
//   next();
// });


router.get('/', UserController.getAllUsers);




// router.get('/:id', (req, res) => {
//     if (new CommonUtil().IsMongoObjectID(req.params.id))
//         new User().findUserById(req.params.id, (err, user) => {
//             if (err)
//                 res.json(new NResponse(false, 200, null, "No User Found!!").Objectify());
//             else
//                 res.send(new NResponse(true, 200, user, "User Found").Objectify());
//         });
//     else
//         res.json(new NResponse(false, 200, null, "No User Found!!").Objectify());
// });
