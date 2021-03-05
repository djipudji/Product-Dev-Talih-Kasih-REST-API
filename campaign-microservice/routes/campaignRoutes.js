const express = require('express'); // Import express
const passport = require('passport'); // Import passport

const router = express.Router(); // Make router
const auth = require('../middlewares/auth'); // Import auth
const campaignController = require('../controllers/campaignController'); // Import campaign Controller
const campaignValidator = require('../middlewares/validators/campaignValidator'); // Import campaign Validator

router.post('/create', [passport.authenticate('user', {session:false}), campaignValidator.create], 
campaignController.create);
router.put('/update/campaign/:campaignId',[passport.authenticate('user', {session:false}), campaignValidator.updateCampaign], 
campaignController.updateCampaign );
router.put('/update/images/:campaignId',[passport.authenticate('user', {session:false}), campaignValidator.updateImages], 
campaignController.updateImages);
router.put('/update/share/:campaign_id', campaignValidator.updateTotalShare, campaignController.updateTotalShare);
router.put('/update/status/:campaignId', [passport.authenticate('admin',{session:false}),campaignValidator.updateStatus],
campaignController.updateStatus);
router.put('/update/wallet/:campaignId',campaignValidator.updateWallet, campaignController.updateWallet);
router.delete('/delete/:campaignId',[passport.authenticate('user', {session:false}), campaignValidator.delete],
campaignController.delete);
router.get('/', campaignController.getAll);
router.get('/byadmin', campaignController.getbyadmin)

let checkUser = async (req, res, next) => {
    if (req.header('Authorization')) {
        passport.authenticate('user', {
            session: false
        }, function (err, user, info) {
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

            req.user = user;

            next();
        })(req, res, next);
    } else {
        next();
    }
};

router.get('/getone/:campaignId', campaignValidator.getOne, checkUser, campaignController.getOne);
router.get('/get/:campaignId', campaignValidator.getOne, campaignController.getOneAxios);
router.get('/user', campaignController.getUser)
router.get('/new', campaignController.getNew);
router.get('/urgen',campaignController.getUrgen);
router.get('/populer',campaignController.getPopuler);
router.get('/category', campaignController.getCategory);
router.get('/title', campaignController.getTitle);
router.get('/donation', campaignController.getLessDonation)
router.put('/update/donation/:campaign_id', campaignController.updateDonationInCampaign)
router.put('/update/user/profile', [passport.authenticate('user', {session: false})], campaignController.updateUserInCampaign)

module.exports = router; // Export router
