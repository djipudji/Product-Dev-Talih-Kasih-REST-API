const axios      = require('axios'),
    https        = require('https'),
    { check, validationResult, matchedData, sanitize } = require('express-validator'),
    { donation } = require('../../models');
    multer       = require('multer'),
    path         = require ('path'),
    crypto       = require('crypto')


    //Axios Intance
const axiosRequest = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized:false
    })
});

function returnHexaNumber(s) {
    var regExp = /^[-+]?[0-9A-Fa-f]+\.?[0-9A-Fa-f]*?$/;
    return (typeof s === 'string' && regExp.test(s));
};

const uploadDirImage = '/img/'; //upload image to /img folder
const storageImage   = multer.diskStorage({
    destination: "./public" + uploadDirImage,
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) return cb(err)
            cb(null, raw.toString('hex') + path.extname(file.originalname))
        })
    }
})

const uploadImage = multer({
    storage: storageImage,
    dest: uploadDirImage,
    fileFilter: (req, file, cb) => {
        if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png') {
            return cb(null, true)
        } else {
            cb(null, false)
            return cb(new Error(`File must be an image! (.jpg or .jpeg or .png)`))
        }
    },
    limits: {
        fileSize: 1 * 1024 * 1024
    }
})

module.exports = {
    create: [
        uploadImage.single('verification_images'),
        check('amount', 'Amount must be a number!').isNumeric().notEmpty(),
        check('message', 'Message must not be empty!').isString().notEmpty(),
        check('name', 'Name must not be empty!').isString().notEmpty(),
        check('campaign').custom(async (value, {req}) => {
            try {
                if((value.length != 24) || !returnHexaNumber(value)) {
                    throw new Error(`ID should have 24 characters and hexa decimal number!`)
                };

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
                throw new Error(`Campaign isn't exist!`)
            }
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

    createMidtrans: [
        check('amount', 'Amount must be a number!').isNumeric().notEmpty(),
        check('message', 'Message must not be empty!').isString().notEmpty(),
        check('name', 'Name must not be empty!').isString().notEmpty(),
        check('campaign').custom(async (value, {req}) => {
            try {
                if((value.length != 24) || !returnHexaNumber(value)) {
                    throw new Error(`ID should have 24 characters and hexa decimal number!`)
                };

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
                throw new Error(`Campaign isn't exist!`)
            }
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

    updateVerification:[
        // check('donationId').custom(async (value, {req})=> {
        //     try{
        //         if((value.length != 24)|| !returnHexaNumber(value)){
        //             throw new Error ('Id must be 24 characters')
        //         };

        //         let findDonation = await donation.findOne({
        //             _id: value  
        //         });

        //         if(!findDonation){
        //             throw new Error ('No Donation Id found')
        //         }
        //     } catch (e){
        //         throw new Error (e)
        //     }
        // }),
        check('isVerified', 'isVerified Must be True or False').isBoolean().notEmpty(),
        (req, res, next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(422).json({
                    errors: errors.mapped()
                })
            }
            next();
        } 
    ]
};