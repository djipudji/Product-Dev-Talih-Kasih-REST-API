const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController.js')
const passport = require('passport');
const auth = require ('../middlewares/auth')
const donationValidator = require('../middlewares/validators/donationValidator.js')

router.post('/donation/create/', [passport.authenticate('user', {session:false}), donationValidator.create], donationController.create)
router.get('/donation/', donationController.getAll)
router.get('/donation/verified/', donationController.getAllVerified)
router.get('/donation/user/', donationController.getAllUser)
router.get('/donation/campaign/', donationController.getAllCampaign)
router.get('/donation/total/:campaign_id', donationController.getTotalDonation)
router.get('/donation/total/length/:campaign_id', donationController.getTotalDonationLength)
router.put('/donation/update/user/profile', [passport.authenticate('user', {session: false})], donationController.updateUserInDonation)
router.put('/donation/update/campaign/:campaign_id', donationController.updateCampaignInDonation)
router.put('/donation/update/verified/:donationId', [passport.authenticate('admin',{session:false}), donationValidator.updateVerification],
donationController.updateVerification);
router.post('/donation/create/midtrans/', [passport.authenticate('user', {session: false}), donationValidator.createMidtrans], donationController.createMidtrans)
router.get('/donation/update/midtrans/', donationController.updateMidtrans)
router.post('/donation/update/midtrans/post/', donationController.updateMidtransPost)

module.exports = router;