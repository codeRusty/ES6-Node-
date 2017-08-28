import express from 'express';
import User from '../models/users';
import NResponse from '../helper/newResponse';
import CommonUtil from '../helper/commonUtil';

var router = express.Router();


// middleware that is specific to this router
// router.use((req, res, next) => {
//   console.log('Time: ', Date.now());
//   next();
// });


router.get('/', (req, res) => {
  new User().allUsers((err, users) => {
    if (err)
      res.json(new NResponse(false, 200, null, "Bad Request").Objectify());
    else
      res.send(new NResponse(true, 200, users, "List of all users").Objectify())
  });
});

router.get('/:id', (req, res) => {
  if (new CommonUtil().IsMongoObjectID(req.params.id))
    new User().findUserById(req.params.id, (err, user) => {
      if (err)
        res.json(new NResponse(false, 200, null, "No User Found!!").Objectify());
      else
        res.send(new NResponse(true, 200, user, "User Found").Objectify());
    });
  else
    res.json(new NResponse(false, 200, null, "No User Found!!").Objectify());
});

router.put('/:id', (req, res) => {
  if (new CommonUtil().IsMongoObjectID(req.params.id))
    new User().updateUserDetails(req.params.id, req.body, (err, user) => {
      if (err)
        res.json(new NResponse(false, 200, err, "No User Found!!").Objectify());
      else
        res.send(new NResponse(true, 200, user, "User updated").Objectify());
    });
  else
    res.json(new NResponse(false, 200, null, "ID Invalid").Objectify());
});
router.delete('/:id', (req, res) => {
  if (new CommonUtil().IsMongoObjectID(req.params.id))
    new User().deavtivateUser(req.params.id, (err, user) => {
      if (err)
        res.json(new NResponse(false, 200, err, "No User Found!!").Objectify());
      else
        res.send(new NResponse(true, 200, user, "User Deleted").Objectify());
    });
  else
    res.json(new NResponse(false, 200, null, "ID Invalid").Objectify());
});



module.exports = router;