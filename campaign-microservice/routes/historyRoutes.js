const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    auth = require('../middlewares/auth'),
    HistoryController = require('../controllers/historyController.js'),
    historyValidator = require('../middlewares/validators/historyValidator.js');

// IF ACCESSING localhost:3001/history/ WE WILL GO TO GET ALL HISTORY VIEW ENDPOINT
router.get('/', HistoryController.getAll);

// IF ACCESSING localhost:3001/history/get WE WILL GO TO GET ONE HISTORY VIEW ENDPOINT
router.get('/get', [historyValidator.getOne], HistoryController.getOne);

// IF ACCESSING localhost:3001/history/get/user WE WILL GO TO GET ALL HISTORY VIEW SORT BY USER ENDPOINT
router.get('/get/user', [historyValidator.getByUser], HistoryController.getByUser);

// IF ACCESSING localhost:3001/history/get/campaign WE WILL GO TO GET ALL HISTORY VIEW SORT BY CAMPAIGN ENDPOINT
router.get('/get/campaign', [historyValidator.getByCampaign], HistoryController.getByCampaign);

// IF ACCESSING localhost:3001/history/update/user/profile WE WILL GO TO UPDATE USER IN HISTORY VIEW ENDPOINT
router.put('/update/user/profile', [passport.authenticate('user', {session: false})], HistoryController.updateUserInHistory)

module.exports = router;