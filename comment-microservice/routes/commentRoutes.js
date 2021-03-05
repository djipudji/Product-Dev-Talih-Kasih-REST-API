const express = require('express'),
    passport = require('passport'),
    router = express.Router(),
    auth = require('../middlewares/auth'),
    CommentController = require('../controllers/commentController.js'),
    commentValidator = require('../middlewares/validators/commentValidator.js');

// IF ACCESSING localhost:3004/comment/ WE WILL GO TO GET ALL COMMENT ENDPOINT
router.get('/', CommentController.getAll);

// IF ACCESSING localhost:3004/comment/get WE WILL GO TO GET ONE COMMENT ENDPOINT
router.get('/get', [commentValidator.getOne], CommentController.getOne);

// IF ACCESSING localhost:3004/comment/get/user WE WILL GO TO GET ALL COMMENT SORT BY USER ENDPOINT
router.get('/get/user', [commentValidator.getByUser], CommentController.getByUser);

// IF ACCESSING localhost:3004/comment/get/campaign WE WILL GO TO GET ALL COMMENT SORT BY CAMPAIGN ENDPOINT
router.get('/get/campaign', [commentValidator.getByCampaign], CommentController.getByCampaign);

// IF ACCESSING localhost:3004/comment/create WE WILL GO TO CREATE COMMENT ENDPOINT
router.post('/create', [passport.authenticate(`user`, {
    session: false
}), commentValidator.create], CommentController.create);

// IF ACCESSING localhost:3004/comment/update/:comment_id WE WILL GO TO UPDATE COMMENT ENDPOINT
router.put('/update/:comment_id', [passport.authenticate(`user`, {
    session: false
}), commentValidator.updateComment], CommentController.updateComment);

// IF ACCESSING localhost:3004/comment/update/user/profile WE WILL GO TO UPDATE USER IN COMMENT ENDPOINT
router.put('/update/user/profile', [passport.authenticate(`user`, {
    session: false
})], CommentController.updateUserInComment);

// IF ACCESSING localhost:3004/comment/delete WE WILL GO TO UPDATE USER IN COMMENT ENDPOINT
router.delete('/delete', [passport.authenticate(`user`, {
    session: false
}), commentValidator.delete], CommentController.delete)

module.exports = router;