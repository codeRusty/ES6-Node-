import express from 'express';
import AccountController from '../controllers/accountController'
var nodemailer = require('nodemailer');
var router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
  //console.log('/Accounts  : :  ', req.body);
  next();
});

router.post('/Registers',  AccountController().registerUser);

router.post('/logins',  AccountController().login);

router.post('/ChangePassword',  AccountController().changePassword);

router.get('/Recovery',  AccountController().enableResetPassword);

router.post('/Reset',  AccountController().verifyToResetPassword);



module.exports = router;