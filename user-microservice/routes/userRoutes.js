const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../middlewares/auth');
const UserController = require('../controllers/userController.js');
const userValidator = require('../middlewares/validators/userValidator.js');

// IF ACCESSING LOCALHOST:3000/user/signup WE WILL GO TO USER SIGNUP ENDPOINT
router.post('/signup', [userValidator.signup, function(req, res, next) {
  passport.authenticate('signup', {
    session: false
  }, function(err, user, info) {
    if (err) {
      return next(err);
    }

    if (!user) {
      res.status(401).json({
        status: 'Error',
        message: info.message
      });
      return;
    }

    UserController.signup(user, req, res);
  })(req, res, next);
}]);

// IF ACCESSING LOCALHOST:3000/user/login WE WILL GO TO USER LOGIN ENDPOINT
router.post('/login', [userValidator.login, function(req, res, next) {
  passport.authenticate('login', {
    session: false
  }, function(err, user, info) {
    if (err) {
      return next(err);
    }

    if (!user) {
      res.status(401).json({
        status: 'Error',
        message: info.message
      });
      return;
    }

    UserController.login(user, req, res);
  })(req, res, next);
}]);

// IF ACCESSING LOCALHOST:3000/user/authorization WE WILL GO TO USER AUTHORIZATION ENDPOINT
router.get('/authorization', function(req, res, next) {
  passport.authenticate('authorization', {
    session: false
  }, function(err, user, info) {
    if (err) {
      return next(err);
    }

    if (!user) {
      res.status(401).json({
        status: 'Error',
        message: info.message
      });
      return;
    }

    UserController.authorization(user, req, res);
  })(req, res, next);
});

// IF ACCESSING LOCALHOST:3000/user/login WE WILL GO TO USER LOGIN WITH GOOGLE ENDPOINT
router.post('/login/google', userValidator.loginGoogle, UserController.loginGoogle)

// IF ACCESSING LOCALHOST:3000/user/forgotpassword WE WILL GO TO GET USER FORGOT PASSWORD STEP 1 ENDPOINT
router.post('/forgotpassword', userValidator.forgotPassword, UserController.forgotPassword)

// IF ACCESSING LOCALHOST:3000/user/forgotpassword/form/:token WE WILL GO TO GET USER FORGOT PASSWORD STEP 2 ENDPOINT
router.put('/forgotpassword/form/:token', userValidator.forgotPasswordForm, UserController.forgotPasswordForm)

// IF ACCESSING LOCALHOST:3000/user/get WE WILL GO TO GET ONE USER ENDPOINT
router.get('/get', userValidator.getOne, UserController.getOne)

// IF ACCESSING LOCALHOST:3000/user/ WE WILL GO TO GET ALL USER ENDPOINT
router.get('/', UserController.getAll)

// IF ACCESSING LOCALHOST:3000/user/profile WE WILL GO TO USER OWN PROFILE ENDPOINT
router.get('/profile', [passport.authenticate('authorization', {
    session: false
})], UserController.getOwnProfile)

// IF ACCESSING LOCALHOST:3000/user/update/profile WE WILL GO TO USER UPDATE OWN PROFILE ENDPOINT
router.put('/update/profile', [userValidator.updateOwnProfile, passport.authenticate('authorization', {
    session: false
})], UserController.updateOwnProfile)

// IF ACCESSING LOCALHOST:3000/user/update/image WE WILL GO TO USER UPDATE PROFILE IMAGE ENDPOINT
router.put('/update/image', [userValidator.updateProfileImage, passport.authenticate('authorization', {
    session: false
})], UserController.updateProfileImage)

// IF ACCESSING LOCALHOST:3000/user/update/email WE WILL GO TO USER UPDATE EMAIL ENDPOINT
router.put('/update/email', [userValidator.updateEmail, passport.authenticate('authorization', {
    session: false
})], UserController.updateEmail)

// IF ACCESSING LOCALHOST:3000/user/update/password WE WILL GO TO USER UPDATE PASSWORD ENDPOINT
router.put('/update/password', [userValidator.updatePassword, passport.authenticate('authorization', {
    session: false
})], UserController.updatePassword)

// IF ACCESSING LOCALHOST:3000/user/delete WE WILL GO TO USER DELETE ENDPOINT
router.delete('/delete', [passport.authenticate('authorization', {
    session: false
})], UserController.deleteProfile)

module.exports = router;