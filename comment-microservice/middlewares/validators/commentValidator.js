const axios = require('axios'),
    https = require('https'),
    { check, validationResult, matchedData, sanitize } = require('express-validator'),
    { comment } = require('../../models');

const axiosRequest = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

function returnHexaNumber(s) {
    var regExp = /^[-+]?[0-9A-Fa-f]+\.?[0-9A-Fa-f]*?$/;
    return (typeof s === 'string' && regExp.test(s));
};

module.exports = {
    getOne: [
        check('comment_id').custom(async (value, {req}) => {
            try {
                if((value.length != 24) || !returnHexaNumber(value)) {
                    throw new Error(`ID should have 24 characters and hexa decimal number!`)
                };

                let getComment = await comment.findOne({
                    _id: value
                });

                if(!getComment) {
                    throw new Error(`Comment isn't exist!`);
                };
            } catch (e) {
                throw new Error(e);
            };
        }),
        (req, res, next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(422).json({
                    errors: errors.mapped()
                });
            };
            next()
        }
    ],

    getByUser : [
        check('user_id').custom(async (value, {req}) => {
            try {
                let getUserAPI = {
                    method: 'get',
                    url: `http://localhost:3000/user/get?user_id=${value}`,
                    headers: {}
                };

                let response = await axiosRequest(getUserAPI);

                let getUser = response.data;

                if(!getUser) {
                    throw new Error(`User isn't exist!`);
                };
            } catch (e) {
                throw new Error(`User isn't exist!`);
            };
        }),
        (req, res, next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(422).json({
                    errors: errors.mapped()
                });
            };
            next()
        }
    ],

    getByCampaign : [
        check(`campaign_id`).custom(async (value, {req}) => {
            try {
                let getCampaignAPI = {
                    method: 'get',
                    url: `http://localhost:3001/campaign/get/${value}`,
                    headers: {}
                };

                let response = await axiosRequest(getCampaignAPI);

                let getCampaign = response.data;

                if(!getCampaign) {
                    throw new Error(`Campaign isn't exist!`);
                };
            } catch (e) {
                throw new Error(`Campaign isn't exist!`);
            };
        }),
        (req, res, next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(422).json({
                    errors: errors.mapped()
                });
            };
            next()
        }
    ],

    create : [
        check(`comment`).isString().notEmpty(),
        check(`campaign_id`).custom(async (value, {req}) => {
            try {
                let getCampaignAPI = {
                    method: 'get',
                    url: `http://localhost:3001/campaign/get/${value}`,
                    headers: {
                        'Authorization': req.header('Authorization')
                    }
                };

                let responseGetCampaignAPI = await axiosRequest(getCampaignAPI);

                let getCampaign = responseGetCampaignAPI.data;

                if(!getCampaign) {
                    throw new Error(`Campaign isn't exist!`)
                };
            } catch (e) {
                throw new Error(`Campaign isn't exist!`);
            };
        }),
        (req, res, next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(422).json({
                    errors: errors.mapped()
                });
            };
            next()
        }
    ],

    updateComment: [
        check(`comment`).isString().notEmpty(),
        check(`comment_id`).custom(async (value, {req}) => {
            try {
                if ((value.length != 24) || !returnHexaNumber(value)) {
                    throw new Error(`ID should have 24 characters and hexa decimal number!`);
                };

                let getComment = await comment.findOne({
                    _id: value
                });

                if (!getComment) {
                    throw new Error(`Comment isn't exist!`);
                };

                if (getComment.user.id != req.user.id) {
                    throw new Error(`Different user between in authorization and in comment!`)
                };
            } catch (e) {
                throw new Error(e);
            };
        }),
        (req, res, next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(422).json({
                    errors: errors.mapped()
                });
            };
            next()
        }
    ],

    delete: [
        check(`comment_id`).custom(async (value, {req}) => {
            try {
                if((value.length != 24) || !returnHexaNumber(value)) {
                    throw new Error(`ID should have 24 characters and hexa decimal number!`);
                };

                let getComment = await comment.findOne({
                    _id: value
                });

                if(!getComment) {
                    throw new Error(`Comment isn't exist!`);
                };

                if (getComment.user.id != req.user.id) {
                    throw new Error(`Different user between in authorization and in comment!`)
                };
            } catch (e) {
                throw new Error(e);
            };
        }),
        (req, res, next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(422).json({
                    errors: errors.mapped()
                });
            };
            next()
        }
    ]
}