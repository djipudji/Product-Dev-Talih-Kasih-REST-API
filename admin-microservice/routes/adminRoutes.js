const express = require('express'),
    passport = require('passport'),
    auth = require('../middlewares/auth'),
    AdminController = require('../controllers/adminController.js'),
    adminValidator = require('../middlewares/validators/adminValidator.js');
    
const router = express.Router();

// IF ACCESSING localhost:3005/admin/signup WE WILL GO TO ADMIN SIGNUP ENDPOINT
router.post('/signup', [adminValidator.signup, function(req, res, next) {
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

    AdminController.signup(user, req, res);
  })(req, res, next);
}]);

// IF ACCESSING localhost:3005/admin/login WE WILL GO TO ADMIN LOGIN ENDPOINT
router.post('/login', [adminValidator.login, function(req, res, next) {
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

    AdminController.login(user, req, res);
  })(req, res, next);
}]);

// IF ACCESSING localhost:3005/admin/authorization WE WILL GO TO ADMIN AUTHORIZATION ENDPOINT
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

    AdminController.authorization(user, req, res);
  })(req, res, next);
});

// IF ACCESSING localhost:3005/admin/get WE WILL GO TO GET ONE ADMIN ENDPOINT
router.get('/get', [adminValidator.getOne], AdminController.getOne);

// IF ACCESSING localhost:3005/admin/ WE WILL GO TO GET ALL ADMIN ENDPOINT
router.get('/', AdminController.getAll)

// IF ACCESSING localhost:3005/admin/profile WE WILL GO TO ADMIN OWN PROFILE ENDPOINT
router.get('/profile', [passport.authenticate('authorization', {
    session: false
})], AdminController.getOwnProfile);

// IF ACCESSING localhost:3005/admin/update/profile WE WILL GO TO ADMIN UPDATE OWN PROFILE ENDPOINT
router.put('/update/profile', [adminValidator.updateOwnProfile, passport.authenticate('authorization', {
    session: false
})], AdminController.updateOwnProfile);

// IF ACCESSING localhost:3005/admin/update/email WE WILL GO TO ADMIN UPDATE EMAIL ENDPOINT
router.put('/update/email', [adminValidator.updateEmail, passport.authenticate('authorization', {
    session: false
})], AdminController.updateEmail);

// IF ACCESSING localhost:3005/admin/update/password WE WILL GO TO ADMIN UPDATE PASSWORD ENDPOINT
router.put('/update/password', [adminValidator.updatePassword, passport.authenticate('authorization', {
    session: false
})], AdminController.updatePassword);

// IF ACCESSING localhost:3005/admin/delete WE WILL GO TO ADMIN DELETE ENDPOINT
router.delete('/delete', [passport.authenticate('authorization', {
    session: false
})], AdminController.deleteProfile);

module.exports = router;