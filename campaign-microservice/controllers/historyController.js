const { history, campaign } = require('../models');
const axios = require('axios');
const https = require('https')
const {ObjectId} = require('mongodb')

const axiosRequest = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

class HistoryController {
    async getAll(req, res) {
        try {
            const {
                page = 1, limit = 10
            } = req.query;

            const getAllHistory = await history.find({},
                    '_id user campaign created_at')
                .sort({created_at: -1})
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();

            const count = await history.countDocuments();

            return res.status(200).json({
                status: `Success get all history data!`,
                data: getAllHistory,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            });
        } catch (e) {
            return res.status(500).json({
                status: `Error!`,
                errors: e
            })
        };
    };

    async getOne(req, res) {
        try {
            const getOneHistory = await history.findOne({
                _id: req.query.history_id
            }, '_id user campaign created_at');

            return res.status(200).json({
                status: `Success get one history data!`,
                data: getOneHistory
            });
        } catch (e) {
            return res.status(500).json({
                status: `Error!`,
                errros: e
            });
        };
    };

    async getByUser(req, res) {
        try {
            const {
                page = 1, limit = 10
            } = req.query;

            const countFindByUser = await history.find({
                "user.id": req.query.user_id
            });

            const findByUser = await history.find({
                    "user.id": req.query.user_id
                }, '_id user campaign created_at')
                .sort({created_at: -1})
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec()

            const count = await countFindByUser.length;

            return res.status(200).json({
                status: `Success get all the history data sort by user!`,
                data: findByUser,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            })
        } catch (e) {
            return res.status(500).json({
                status: `Error!`,
                errors: e
            })
        };
    };

    async getByCampaign(req, res) {
        try {
            const {
                page = 1, limit = 10
            } = req.query;

            const campaignObjectId = new ObjectId(req.query.campaign_id)

            const countFindByCampaign = await history.find({
                "campaign._id": campaignObjectId
            })

            const findByCampaign = await history.find({
                    "campaign._id": campaignObjectId
                }, '_id user campaign created_at')
                .sort({created_at: -1})
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec()

            const count = await countFindByCampaign.length;

            return res.status(200).json({
                status: `Success get all the history data sort by campaign!`,
                data: findByCampaign,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            });
        } catch (e) {
            return res.status(500).json({
                status: `Error!`,
                errros: e
            });
        };
    };

    async updateUserInHistory(req, res) {
        try {
            let getUserAPI = {
                method: 'get',
                url: 'http://localhost:3000/user/profile',
                headers: {
                    'Authorization': req.header('Authorization')
                }
            };

            let responseGetUserAPI = await axiosRequest(getUserAPI);

            let getUser = responseGetUserAPI.data.data;

            let updatedUserInHistory = await history.updateMany({
                "user.id": {
                    $eq: getUser.id
                }
            }, {
                $set: {
                    "user": getUser
                }
            });

            return res.status(200).json({
                status: `Success update user also in history api!`,
                data: getUser
            });
        } catch (e) {
            return res.status(500).json({
                status: `Failed update user in history api!`,
                errors: e
            })
        };
    };
};

module.exports = new HistoryController