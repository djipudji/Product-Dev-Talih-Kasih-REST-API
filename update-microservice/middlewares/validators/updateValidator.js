const axios = require('axios'),
    https = require('https'),
    { check, validationResult, matchedData, sanitize } = require('express-validator'),
    { update } = require('../../models');

const axiosRequest = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

module.exports = {
    createWithOutAmount: [
        check(`message`).isString().notEmpty(),
        check(`campaign_id`).custom(async (value, {req}) => {
            try {
                let getCampaignAPI = {
                    method: 'get',
                    url: `http://localhost:3001/campaign/get/${value}`,
                    // headers: {
                    //     'Authorization': req.header('Authorization')
                    // }
                };

                let responseGetCampaignAPI = await axiosRequest(getCampaignAPI);

                let getCampaign = responseGetCampaignAPI.data.data.wallet;
                
                if(req.body.amount > getCampaign){
                    throw new Error ('Amount cannot more than donation that you get')
                };
            } catch (e) {
                throw new Error (e)
            }
        }),
        (req, res,next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(422).json({
                    errors: errors.mapped()
                });
            };
            next()
        }
    ],

    createWithAmount: [
        check(`message`).isString().notEmpty(),
        check('amount').isNumeric().notEmpty(),
        check(`campaign_id`).custom(async (value, {req}) => {
            try {
                let getCampaignAPI = {
                    method: 'get',
                    url: `http://localhost:3001/campaign/get/${value}`,
                    // headers: {
                    //     'Authorization': req.header('Authorization')
                    // }
                };

                let responseGetCampaignAPI = await axiosRequest(getCampaignAPI);

                let getCampaign = responseGetCampaignAPI.data.data.wallet;
                
                if(req.body.amount > getCampaign || req.body.amount < 0){
                    throw new Error ('Amount cannot more than current wallet')
                };
            } catch (e) {
                throw new Error (e)
            }
        }),
        (req, res,next) => {
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
    ]
}