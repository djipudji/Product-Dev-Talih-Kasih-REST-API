const { history, campaign } = require('../../models'),
    https = require('https'),
    axios = require('axios'),
    { check, validationResult, matchedData, sanitize } = require('express-validator');

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
        check('history_id').custom(async (value, {req}) => {
            try {
                if((value.length != 24) || !returnHexaNumber(value)) {
                    throw new Error(`History ID should have 24 characters and hexa decimal number!`)
                };

                let getHistory = await history.findOne({
                    _id: value
                });

                if(!getHistory) {
                    throw new Error(`History data not found!`)
                };
            } catch (e) {
                throw new Error(e)
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

    getByUser: [
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

    getByCampaign: [
        check('campaign_id').custom(async (value, {req}) => {
            try {
                if((value.length != 24) || !returnHexaNumber(value)) {
                    throw new Error(`Campaign ID should have 24 characters and hexa decimal number!`)
                };

                let getCampaign = await campaign.findOne({
                    _id: value
                });

                if(!getCampaign) {
                    throw new Error(`Campaign isn't exist!`)
                };
            } catch (e) {
                throw new Error(`Campaign isn't exist!`)
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