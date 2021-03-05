const express           = require('express');
const router            = express.Router();
const updateController  = require('../controllers/updateController.js')
const passport          = require('passport');
const updateValidator   = require('../middlewares/validators/updateValidator.js');
const auth              = require ('../middlewares/auth')


router.post('/create/withdraw', updateValidator.createWithAmount, updateController.create)
router.post('/create', updateValidator.createWithOutAmount, updateController.create)
router.get('/get', updateValidator.getByCampaign, updateController.getAllbyCampaign)
router.get('/get/user', updateValidator.getByUser, updateController.getAllbyUser)
router.get('/get/withdraw', updateController.getAllWithdraw)
router.get('/get/all', updateController.getAll)

module.exports = router;