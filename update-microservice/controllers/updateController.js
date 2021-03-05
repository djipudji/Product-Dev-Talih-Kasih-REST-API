const axios  = require('axios')
const {update} = require('../models')
const https  = require('https')
const qs = require('qs');

const axiosRequest = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

class updateController {
    async create(req, res) {
        try {
            // Get User info from another service
            let getUserAPI = {
                method: 'get',
                url: `http://localhost:3000/user/profile`,
                headers: {
                    'Authorization': req.header('Authorization')
                }
            }

            // Get response from UserAPI
            let responseGetUser = await axiosRequest(getUserAPI);

            // Get user data from response
            let getUser = responseGetUser.data.data;

            let getCampaignAPI = {
                method: 'get',
                url: `http://localhost:3001/campaign/get/${req.body.campaign_id}`,
                headers: {
                    'Authorization': req.header('Authorization')
                }
            };

            // // Get response from getCampaignAPI
            let responseGetCampaign = await axiosRequest(getCampaignAPI);

            // // Get campaign data from response
            let getCampaign = responseGetCampaign.data.data;


            let createUpdate = await update.create({
                amount: req.body.amount,
                message: req.body.message,
                user: getUser,
                campaign: getCampaign
            })

            var data = qs.stringify({
                'wallet': getCampaign.wallet - req.body.amount
               });

            var updateWitdrawInWallet = {
                method: 'put',
                url: `http://localhost:3001/campaign/update/wallet/${getCampaign._id}`,
                headers: { 
                    'Authorization': req.header('Authorization'), 
                    'Content-Type': 'application/x-www-form-urlencoded'
                }, 
                data : data
            };

            let responseupdateWithdrawInWallet = axiosRequest(updateWitdrawInWallet);

            let getUpdateDonationInWallet = responseupdateWithdrawInWallet.data

            let newUpdate = await update.findOne({
                _id: createUpdate._id
            }, 'id message amount user campaign createAt updatedAt')

            return res.status(200).json({
                status: 'update created',
                data: newUpdate
                })

        } catch (err) {
            return res.status(500).json({
                status: 'Error',
                errors: err
            }, console.log(err))

        }
    }
    
    async getAll(req, res) {
        try {
            const { page = 1, limit = 10} = req.query;

            getAllUpdate = await update.find({}, 'id message amount user campaign createAt updatedAt')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
            const count = await update.countDocuments();
            
            return res.status(200).json({
                status: "Get all Update",
                data: getAllUpdate,
                totalPages: Math.ceil(count/limit),
                currentPage: page
            })
        } catch (err) {
            return res.status(500).json({
                status: 'error',
                error: err
            })
        }
    }

    async getAllWithdraw(req, res){
        try {
            const {page = 1, limit = 10} = req.query;

            const countAllWithdraw = await update.find({ amount: { $gte: 0}
             }, 'id message amount user campaign createAt updateAt')

            const getAllWithdraw = await update.find({ amount: { $gte: 0}
            }, 'id message amount user campaign createAt updateAt')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

            const count = countAllWithdraw.length

            res.status(200).json({
                status: "Get all update with Amount",
                data: getAllWithdraw,
                totalPages: Math.ceil(count/limit),
                currentPage: page
            })            

        } catch (err){ console.log(err)
            return res.status(500).json({
                status: "error",
                error: err
            })
        }
    }

    async getAllbyUser(req, res){
        try {
            const { page = 1, limit = 10} = req.query;
            
            const countbyuser = await update.find({
                "user.id": req.query.user_id
            }, 'id message amount user campaign createAt updatedAt')

            const getbyuser = await update.find({
                "user.id": req.query.user_id
            }, 'id message amount user campaign createAt updatedAt')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

            const count = countbyuser.length;

            return res.status(200).json({
                status: "Get all Update",
                data: getbyuser,
                totalPages: Math.ceil(count/limit),
                currentPage: page
            })
        } catch (err){
            return res.status(500).json({
                status: 'error',
                error: err
            }) 
        }

    }

    async getAllbyCampaign(req, res) {
        try {
            const { page = 1, limit = 10} = req.query;
            
            const countbycampaign = await update.find({
                "campaign._id": req.query.campaign_id
            }, '_id message amount user campaign createAt updatedAt')

            const getbycampaign = await update.find({
                "campaign._id": req.query.campaign_id
            }, 'id message amount user campaign createAt updatedAt')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

            const count = countbycampaign.length;

            return res.status(200).json({
                status: "Get all Update",
                data: getbycampaign,
                totalPages: Math.ceil(count/limit),
                currentPage: page
            }) 

        } catch (err) {
            return res.status(500).json({
                status: 'error',
                error: err
            })
        }
    }
};

module.exports = new updateController