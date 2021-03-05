const axios = require('axios');
const qs = require('qs');
const https = require('https');
// const donation = require('../models').donation;
const {donation} = require('../models')
const {ObjectId} = require('mongodb')

const path = require('path');
require('dotenv').config({
    path: `./environments/.env.${process.env.NODE_ENV}`
})

const axiosRequest = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

class donationController {

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
                url: `http://localhost:3001/campaign/get/${req.body.campaign}`,
                headers: {
                    'Authorization': req.header('Authorization')
                }
            };

            let responseGetCampaignAPI = await axiosRequest(getCampaignAPI);

            let getCampaign = responseGetCampaignAPI.data.data;

            if(req.body.amount <= 0){
                throw new Error ('Amount cannot be a minus or 0!')
            };

            // Create a Donation
            let createDonation = await donation.create({
                verification_images: req.file === undefined ? "" : req.file.filename,
                amount: req.body.amount,
                message: req.body.message,
                name: req.body.name,
                campaign: getCampaign,
                user: getUser         
            });

            // console.log(getUpdateDonationInCampaign)

            // if(!getUpdateDonationInCampaign) {
            //     throw new Error(`Axios in donation API failed to execute in campaign API`)
            // }

            let newDonation = await donation.findOne({
                _id: createDonation._id
            }, '_id amount message name isVerified verification_images user campaign token redirect_url user_token createdAt');

            return res.status(200).json({
                status: 'donation created',
                data: newDonation
            });

        } catch (e) {

            return res.status(500).json({
                status: 'error',
                errors: e
            })
        };
    };

    async createMidtrans(req, res) {
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
                url: `http://localhost:3001/campaign/get/${req.body.campaign}`,
                headers: {
                    'Authorization': req.header('Authorization')
                }
            };

            let responseGetCampaignAPI = await axiosRequest(getCampaignAPI);

            let getCampaign = responseGetCampaignAPI.data.data;

            if (req.body.amount <= 0) {
                throw new Error('Amount cannot be a minus or 0!')
            };

            let user_token = req.header('Authorization')

            // Create a Donation
            let createDonation = await donation.create({
                verification_images: "USING MIDTRANS",
                amount: req.body.amount,
                message: req.body.message,
                name: req.body.name,
                campaign: getCampaign,
                user: getUser,
                user_token: user_token
            });

            let newDonation = await donation.findOne({
                _id: createDonation._id
            }, '_id amount message name isVerified verification_images user campaign token redirect_url user_token createdAt')

            var data = JSON.stringify({
                "transaction_details": {
                    "order_id": `${newDonation._id}`,
                    "gross_amount": newDonation.amount
                },
                "callbacks": {
                    "finish": `https://www.talikasih.tech/donatesuccess/${newDonation.campaign._id}/`
                },
                "expiry": {
                    "unit": "hours",
                    "duration": 3
                },
                "customer_details": {
                    "email": `${newDonation.user.email}`
                }
            });

            var config = {
                method: 'post',
                url: 'https://app.sandbox.midtrans.com/snap/v1/transactions',
                headers: {
                    'Authorization': process.env.MIDTRANS_AUTH,
                    'Content-Type': 'application/json'
                },
                data: data
            };

            let response = await axios(config);

            let newData = response.data;

            let updateDonation = await donation.findOneAndUpdate({
                _id: newDonation._id
            }, {
                $set: newData
            }, {
                new: true
            });

            return res.status(200).json({
                status: 'donation created',
                data: updateDonation
            });
        } catch (e) {
            return res.status(500).json({
                status: 'Error!',
                errors: e
            });
        };
    };

    async updateMidtrans(req, res) {
        try {
            let midtrans = req.query;

            let isVerified;

            if (midtrans.status_code == 200) {
                isVerified = true
            } else if (midtrans.status_code == 201) {
                isVerified = false
            };

            let updateDonation = await donation.findOneAndUpdate({
                _id: midtrans.order_id
            }, {
                $set: {
                    isVerified: isVerified
                }
            }, {
                new: true
            });

            if (updateDonation.isVerified == true) {
                try {
                    let getCampaignAPI = {
                        method: 'get',
                        url: `http://localhost:3001/campaign/get/${updateDonation.campaign._id}`,
                        headers: {
                            'Authorization': updateDonation.user_token
                        }
                    };

                    let responseGetCampaignAPI = await axiosRequest(getCampaignAPI);

                    let getCampaign = responseGetCampaignAPI.data.data;

                    let updateDonationInCampaign = {
                        method: 'put',
                        url: `http://localhost:3001/campaign/update/donation/${updateDonation.campaign._id}`,
                        headers: {
                            'Authorization': updateDonation.user_token
                        }
                    };

                    let responseUpdateDonationInCampaign = await axiosRequest(updateDonationInCampaign);

                    let getUpdateDonationInCampaign = responseUpdateDonationInCampaign.data;

                    var data = qs.stringify({
                        'wallet': getCampaign.wallet + updateDonation.amount
                    });

                    var updateDonationInWallet = {
                        method: 'put',
                        url: `http://localhost:3001/campaign/update/wallet/${updateDonation.campaign._id}`,
                        headers: {
                            'Authorization': updateDonation.user_token,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: data
                    };

                    let responseUpdateDonationInWallet = await axiosRequest(updateDonationInWallet);

                    let getUpdateDonationInWallet = responseUpdateDonationInWallet.data

                    let newDonation = await donation.findOne({
                        _id: updateDonation._id
                    })

                    return res.status(200).json({
                        status: 'Payment Success',
                        data: newDonation
                    });
                } catch (err) {
                    return res.status(500).json({
                        status: "error",
                        errors: err
                    });
                };
            };

            let newDonation = await donation.findOne({
                _id: updateDonation._id
            });
            
            return res.status(200).json({
                status : 'Payment Pending',
                data: newDonation
            });

        } catch (e) {
            return res.status(500).json({
                status: "error",
                errors: e
            });
        };
    };

    async updateMidtransPost(req, res) {
        try {
            let midtrans = req.body;

            let isVerified;

            if (midtrans.status_code == 200) {
                isVerified = true
            } else if (midtrans.status_code == 201) {
                isVerified = false
            };

            let updateDonation = await donation.findOneAndUpdate({
                _id: midtrans.order_id
            }, {
                $set: {
                    isVerified: isVerified
                }
            }, {
                new: true
            });

            if (updateDonation.isVerified == true) {
                try {
                    let getCampaignAPI = {
                        method: 'get',
                        url: `http://localhost:3001/campaign/get/${updateDonation.campaign._id}`,
                        headers: {
                            'Authorization': updateDonation.user_token
                        }
                    };

                    let responseGetCampaignAPI = await axiosRequest(getCampaignAPI);

                    let getCampaign = responseGetCampaignAPI.data.data;

                    let updateDonationInCampaign = {
                        method: 'put',
                        url: `http://localhost:3001/campaign/update/donation/${updateDonation.campaign._id}`,
                        headers: {
                            'Authorization': updateDonation.user_token
                        }
                    };

                    let responseUpdateDonationInCampaign = await axiosRequest(updateDonationInCampaign);

                    let getUpdateDonationInCampaign = responseUpdateDonationInCampaign.data;

                    var data = qs.stringify({
                        'wallet': getCampaign.wallet + updateDonation.amount
                    });

                    var updateDonationInWallet = {
                        method: 'put',
                        url: `http://localhost:3001/campaign/update/wallet/${updateDonation.campaign._id}`,
                        headers: {
                            'Authorization': updateDonation.user_token,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: data
                    };

                    let responseUpdateDonationInWallet = await axiosRequest(updateDonationInWallet);

                    let getUpdateDonationInWallet = responseUpdateDonationInWallet.data

                    let newDonation = await donation.findOne({
                        _id: updateDonation._id
                    })

                    return res.status(200).json({
                        status: 'Payment Success',
                        data: newDonation
                    });
                } catch (err) {
                    return res.status(500).json({
                        status: "error",
                        errors: err
                    });
                };
            };

            let newDonation = await donation.findOne({
                _id: updateDonation._id
            });
            
            return res.status(200).json({
                status : 'Payment pending',
                data: newDonation
            });

        } catch (e) {
            return res.status(500).json({
                status: "error",
                errors: e
            });
        };
    };

    async updateVerification(req, res){
        try {
            const agent = new https.Agent({
                rejectUnauthorized: false
            })

            let updateDonation = await donation.findOneAndUpdate({
                _id: req.params.donationId
            }, {
                isVerified: req.body.isVerified
            }, {
                new: true
            })

            let getCampaignAPI = {
                method: 'get',
                url: `http://localhost:3001/campaign/get/${updateDonation.campaign._id}`,
                headers: {
                    'Authorization': req.header('Authorization')
                }
            };

            let responseGetCampaignAPI = await axiosRequest(getCampaignAPI);

            let getCampaign = responseGetCampaignAPI.data.data;

            if (updateDonation.isVerified == true) {
                try {
                    let updateDonationInCampaign = {
                        method: 'put',
                        url: `http://localhost:3001/campaign/update/donation/${updateDonation.campaign._id}`,
                        headers: {
                            'Authorization': req.header('Authorization')
                        }
                    };

                    let responseUpdateDonationInCampaign = await axiosRequest(updateDonationInCampaign);

                    let getUpdateDonationInCampaign = responseUpdateDonationInCampaign.data;


                    var data = qs.stringify({
                        'wallet': getCampaign.wallet + updateDonation.amount
                    });

                    var updateDonationInWallet = {
                        method: 'put',
                        url: `http://localhost:3001/campaign/update/wallet/${updateDonation.campaign._id}`,
                        headers: {
                            'Authorization': req.header('Authorization'),
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: data
                    };

                    let responseUpdateDonationInWallet = await axiosRequest(updateDonationInWallet);

                    let getUpdateDonationInWallet = responseUpdateDonationInWallet.data

                    let newDonation = await donation.findOne({
                        _id: updateDonation._id
                    }, '_id amount message isVerified')

                    return res.status(200).json({
                        status: 'success update donation',
                        data: newDonation
                    })
                } catch (err) {
                    return res.status(500).json({
                        status: "error",
                        errors: err
                    })
                }
            }

            let newDonation = await donation.findOne({
                _id: updateDonation._id
            }, '_id amount message isVerified')
            
            return res.status(200).json({
                status : 'success update donation',
                data: newDonation
            })

        } catch (err){
            return res.status(500).json({
                status: "error",
                errors: err
            })
        }
    }

    // Get all donation (literally ALL Donation)
    async getAll(req, res) {       
        try {            
            const { page = 1, limit = 10 } = req.query;

            const getAllDonation = await donation.find({}, '_id amount message name isVerified verification_images user campaign token redirect_url user_token createdAt')
            .sort({createdAt: -1})
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

            const count = await donation.countDocuments();

            return res.status(200).json({
                status:'Success get all donation',
                data: getAllDonation,
                totalpage: Math.ceil(count / limit),
                currentPage : page
            }) 
        
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                status: 'Error',
                errors: err,
  
            })
        }
    };

    async getAllVerified(req, res) {       
        try {            
            const { page = 1, limit = 10 } = req.query;

            const countPages = await donation.find({
                isVerified: false
            }, '_id amount message name isVerified verification_images user campaign token redirect_url user_token createdAt')
            
            const getAllDonation = await donation.find({
                    isVerified: false
                }, '_id amount message name isVerified verification_images user campaign token redirect_url user_token createdAt')
                .sort({createdAt: -1})
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();

            const count = await countPages.length;

            return res.status(200).json({
                status:'Success get all donation',
                data: getAllDonation,
                totalpage: Math.ceil(count / limit),
                currentPage : page
            }) 
        
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                status: 'Error',
                errors: err,
  
            })
        }
    };

    //Get all donation from user
    async getAllUser(req, res) {
        try {
            const {
                page = 1, limit = 10
            } = req.query;

            const gettingUserDonation = await donation.find({
                "user.id": req.query.user_id
            }, '_id amount message name isVerified verification_images user campaign token redirect_url user_token createdAt')

            const post = await donation.find({
                    "user.id": req.query.user_id
                }, '_id amount message name isVerified verification_images user campaign token redirect_url user_token createdAt')
                .sort({createdAt: -1})
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();

            const count = await gettingUserDonation.length;

            return res.status(200).json({
                status: 'Success get all donation by user',
                data: post,
                totalpage: Math.ceil(count / limit),
                currentPage: page
            })
        } catch (err) {
            return res.status(500).json({
                status: ' Error',
                errors: err
            })
        };
    };

    //Get all donation from campaign
    async getAllCampaign(req, res) {
        try {
            const {
                page = 1, limit = 10
            } = req.query;

            const gettingCampaignDonation = await donation.find({
                "campaign._id": req.query.campaign_id,
                isVerified: true
            }, '_id amount message name isVerified verification_images user campaign token redirect_url user_token createdAt')

            const post = await donation.find({
                    "campaign._id": req.query.campaign_id,
                    isVerified: true
                }, '_id amount message name isVerified verification_images user campaign token redirect_url user_token createdAt')
                .sort({createdAt: -1})
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec()

            const count = await gettingCampaignDonation.length;

            return res.status(200).json({
                status: `Success get all donation by campaign`,
                data: post,
                totalpage: Math.ceil(count / limit),
                currentPage: page
            });
        } catch (e) {
            return res.status(500).json({
                status: `Error`,
                errors: e
            })
        }
    }

    // Calculate all donation from campaign
    async getTotalDonation(req, res){
        try {
            const gettingTotalDonation = await donation.find({
                "campaign._id": req.params.campaign_id,
                isVerified: true
            })
            let sumTotal = 0
            // await 
            await gettingTotalDonation.forEach((item, i) => {
                sumTotal += item.amount
            });
            return res.status(200).json({
                status: 'success get total',
                data: sumTotal
            })
        } catch (err) {
            return res.status(500).json({
                status: 'Error',
                errors: err
            })
        }
    };

    async getTotalDonationLength(req, res) {
        try {
            const gettingTotalDonation = await donation.find({
                "campaign._id": req.params.campaign_id,
                isVerified: true
            });

            const countLength = gettingTotalDonation.length;

            return res.status(200).json({
                status: `success get total donation length!`,
                data: countLength
            });
        } catch (e) {
            return res.status(500).json({
                status: 'Error!',
                errors: e
            });
        };
    };

    async updateUserInDonation(req, res) {
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

            let updatedUserInDonation = await donation.updateMany({
                "user.id": {
                    $eq: getUser.id
                }
            }, {
                $set: {
                    "user": getUser
                }
            });

            return res.status(200).json({
                status: `Success update user also in donation!`,
                data: getUser
            });
        } catch (e) {
            return res.status(500).json({
                status: `Failed update user in donation! (Donation API)`,
                errors: e
            })
        };
    };

    async updateCampaignInDonation(req, res) {
        try {
            let getCampaignAPI = {
                method: 'get',
                url: `http://localhost:3001/campaign/get/${req.params.campaign_id}`,
                headers: {}
            };

            let responseGetCampaignAPI = await axiosRequest(getCampaignAPI);

            let getCampaign = responseGetCampaignAPI.data.data;

            let updatedCampaignInDonation = await donation.updateMany({
                "campaign._id": {
                    $eq: getCampaign._id
                }
            }, {
                $set: {
                    "campaign": getCampaign
                }
            });

            return res.status(200).json({
                status: `Success update campaign in Donation API!`
            });
        } catch (e) {
            return res.status(500).json({
                status: `Failed to update campaign in Donation API!`,
                errors: e
            });
        };
    };
};
module.exports = new donationController;