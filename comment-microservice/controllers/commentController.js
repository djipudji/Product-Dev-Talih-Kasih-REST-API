const { comment } = require('../models'),
    axios = require('axios'),
    https = require('https'),
    { ObjectId } = require('mongodb');

const axiosRequest = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

class CommentController {
    async getAll(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;

            const getAllComment = await comment.find({},
                    '_id comment user campaign created_at updated_at')
                .sort({created_at: -1})
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();

            const count = await comment.countDocuments();
            
            return res.status(200).json({
                status: `Success get all the comment!`,
                data: getAllComment,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            });
        } catch (e) {
            return res.status(500).json({
                status: `Error!`,
                errors: e
            });
        };
    };

    async getOne(req, res) {
        try {
            let getOneComment = await comment.findOne({
                _id: req.query.comment_id
            }, '_id comment user campaign created_at updated_at');

            return res.status(200).json({
                status: `Success get one comment!`,
                data: getOneComment
            });
        } catch (e) {
            return res.status(500).json({
                status: `Error!`,
                errors: e
            });
        };
    };

    async getByUser(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;

            const countFindByUser = await comment.find({
                "user.id": req.query.user_id
            }, '_id comment user campaign created_at updated_at');

            const findByUser = await comment.find({
                    "user.id": req.query.user_id
                }, '_id comment user campaign created_at updated_at')
                .sort({created_at: -1})
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();

            const count = await countFindByUser.length;

            return res.status(200).json({
                status: `Success get comment by user!`,
                data: findByUser,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            });
        } catch (e) {
            return res.status(500).json({
                status: `Error!`,
                errors: e
            });
        };
    };

    async getByCampaign(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;

            const countFindByCampaign = await comment.find({
                "campaign._id": req.query.campaign_id
            }, '_id comment user campaign created_at updated_at');

            const findByCampaign = await comment.find({
                    "campaign._id": req.query.campaign_id
                }, '_id comment user campaign created_at updated_at')
                .sort({created_at: -1})
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();

            const count = await countFindByCampaign.length;

            return res.status(200).json({
                status: `Success get comment by campaign!`,
                data: findByCampaign,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            });
        } catch (e) {
            return res.status(500).json({
                status: `Error!`,
                errors: e
            });
        };
    };

    async create(req, res) {
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

            let getCampaignAPI = {
                method: 'get',
                url: `http://localhost:3001/campaign/get/${req.body.campaign_id}`,
                headers: {
                    'Authorization': req.header('Authorization')
                }
            };

            let responseGetCampaignAPI = await axiosRequest(getCampaignAPI);

            let getCampaign = responseGetCampaignAPI.data.data;

            let createComment = await comment.create({
                comment: req.body.comment,
                user: getUser,
                campaign: getCampaign
            });

            let newComment = await comment.findOne({
                _id: createComment._id
            }, '_id comment user campaign created_at updated_at');

            return res.status(200).json({
                status: `Success create a comment!`,
                data: newComment
            });
        } catch (e) {
            return res.status(500).json({
                status: "Error!",
                errors: e
            });
        };
    };

    async updateComment(req, res) {
        try {
            const updatedComment = await comment.findOneAndUpdate({
                _id: req.params.comment_id
            }, {
                comment: req.body.comment
            }, {
                new: true
            });
            
            return res.status(200).json({
                status: `Success update a comment!`,
                data: updatedComment
            });
        } catch (e) {
            return res.status(500).json({
                status: `Error!`,
                errors: e
            })
        };
    };

    async updateUserInComment(req, res) {
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

            let updatedUserInComment = await comment.updateMany({
                "user.id": {
                    $eq: getUser.id
                }
            }, {
                $set: {
                    "user": getUser
                }
            });

            return res.status(200).json({
                status: `Success update user also in comment!`,
                data: getUser
            });
        } catch (e) {
            return res.status(500).json({
                status: `Error update user in comment! (Comment API)`,
                errors: e
            })
        };
    };

    async delete(req, res) {
        try {
            let deleteComment = await comment.delete({
                _id: req.query.comment_id
            });

            return res.status(200).json({
                status: `Success delete a comment!`,
                data: null
            });
        } catch (e) {
            return res.status(500).json({
                status: `Error!`,
                errors: e
            });
        };
    };
};

module.exports = new CommentController;