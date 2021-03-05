const { user } = require('../models');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const axios = require(`axios`);
const https = require(`https`);
const fs = require('fs')
const nodemailer = require('nodemailer');
const path = require('path')
require('dotenv').config({
    path: `./environments/.env.${process.env.NODE_ENV}`
});

const transporter = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE,
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: true,
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
})

const axiosRequest = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

class UserController {
    async signup(user, req, res) {
        try {
            const body = {
                id: user.id,
                email: user.email
            };

            const token = jwt.sign({
                user: body
            }, 'secret_password');

            const date = new Date().toString();

            const mailOption = {
                from: 'talikasih.batch9@gmail.com',
                to: user.email,
                subject: 'Talikasih Registration',
                html: `Hello,<br> Thankyou for registering in Tali Kasih!<br> We are waiting for you to share kindness to everyone!<br> Your Registration Data: <br> Email: ${user.email}<br> Date Time: ${date}<br><br><br> <b> (PLEASE DO NOT REPLY TO THIS EMAIL!) </b>`
            };

            const sendEmail = await transporter.sendMail(mailOption);

            return res.status(200).json({
                message: 'Signup success!',
                token: token
            });
        } catch (e) {
            return res.status(401).json({
                status: 'Error!',
                message: e
            });
        };
    };

    async login(user, req, res) {
        try {
            const body = {
                id: user.id,
                email: user.email
            };

            const token = jwt.sign({
                user: body
            }, 'secret_password');

            return res.status(200).json({
                message: 'Login success!',
                token: token
            });
        } catch (e) {
            return res.status(401).json({
                status: 'Error!',
                message: e
            });
        };
    };

    async loginGoogle(req, res) {
        try {
            const { name, email, password } = req.body;

            const findUser = await user.findOne({
                where: {
                    email: email
                }
            });

            if (!findUser) {
                let createUser = await user.create({
                    email: email,
                    name: name,
                    password: password
                });

                let newUser = await user.findOne({
                    where: {
                        id: createUser.id
                    },
                    attributes: ['id', 'email']
                });

                let body = {
                    id: newUser.id,
                    email: newUser.email
                };

                let token = jwt.sign({
                    user: body
                }, 'secret_password');

                return res.status(200).json({
                    message: `Login google success!`,
                    token: token
                });
            };

            let body = {
                id: findUser.id,
                email: findUser.email
            };

            let token = jwt.sign({
                user: body
            }, 'secret_password');

            return res.status(200).json({
                message: `Login google success!`,
                token: token
            });
        } catch (e) {
            return res.status(500).json({
                message: `Error!`,
                errors: e
            });
        };
    };

    async authorization(user, req, res) {
        try {
            return res.status(200).json({
                status: "Success!",
                message: "Authorized!",
                user: user
            });
        } catch (e) {
            return res.status(401).json({
                status: "Error!",
                message: "Unauthorized!"
            });
        };
    };

    async forgotPassword(req, res) {
        try {
            const email = req.body.email;

            const body = await user.findOne({
                where: {
                    email: email
                },
                attributes: ['id', 'email']
            });

            const token = jwt.sign({
                user: body
            }, 'secret_password', {
                expiresIn: '1h'
            });

            const mailOption = {
                from: 'talikasih.batch9@gmail.com',
                to: email,
                subject: 'Talikasih User Forgot Password',
                html: "Hello, Good People!<br> Please click on the link below to reset your password!<br><br><a href="+"https://www.talikasih.tech/passwordrecovery/"+token+">Click here to reset your password!</a> <br><br><br> <b> (PLEASE DO NOT REPLY TO THIS EMAIL!) </b>"
            };

            const sendEmail = await transporter.sendMail(mailOption);

            return res.status(200).json({
                status: 'The link to reset your password has been sent to your email!',
                message: 'Please kindly check your email and follow the step to reset your password!'
            });
        } catch (e) {
            return res.status(500).json({
                status: `Error!`,
                errors: e
            });
        };
    };

    async forgotPasswordForm(req, res) {
        try {
            const token = req.params.token;

            const body = {
                password: req.body.password
            };

            const decoded = jwt.decode(token);

            if(decoded === null) {
                return res.status(422).json({
                    status: `Error token!`
                })
            }

            const updateUser = await user.update(body, {
                where: {
                    id: decoded.user.id
                }
            });

            if(!updateUser) {
                return res.status(422).json({
                    status: `Cannot reset user password!`
                })
            }

            return res.status(200).json({
                status: 'Successfully reset your password!',
                message: 'Please login with your new password to continue!'
            })
        } catch (e) {
            return res.status(500).json({
                status: `Error!`,
                errors: e
            })
        }
    }

    async getOne(req, res) {
        try {
            const findUser = await user.findOne({
                where: {
                    id: req.query.user_id
                },
                attributes: ['id', 'name', 'email', 'bank_name', 'bank_account_number', 'profile_image', 'createdAt']
            });

            return res.status(200).json({
                message: "Success!",
                data: findUser
            });
        } catch (e) {
            return res.status(422).json({
                status: "Error!",
                message: "User is not exist!"
            });
        };
    };

    async getAll(req, res) {
        try {
            const findAllUser = await user.findAll({
                attributes: ['id', 'name', 'email', 'bank_name', 'bank_account_number', 'profile_image', 'createdAt'],
                order: [['createdAt', 'ASC']]
            });

            return res.status(200).json({
                message: "Success!",
                data: findAllUser
            });
        } catch (e) {
            return res.status(422).json({
                status: "Error!",
                message: e
            });
        };
    };

    async getOwnProfile(req, res) {
        try {
            const findOwnProfile = await user.findOne({
                where: {
                    id: req.user.dataValues.id
                },
                attributes: ['id', 'name', 'email', 'bank_name', 'bank_account_number', 'profile_image', 'createdAt']
            });

            return res.status(200).json({
                message: "Success!",
                data: findOwnProfile
            });
        } catch (e) {
            return res.status(422).json({
                status: "Error!",
                message: e
            });
        };
    };

    async updateOwnProfile(req, res) {
        try {
            const body = {
                name: req.body.name,
                bank_name: req.body.bank_name,
                bank_account_number: req.body.bank_account_number
            };

            const updateUser = await user.update(body, {
                where: {
                    id: req.user.dataValues.id
                }
            });

            const updateUserInComment = {
                method: 'put',
                url: 'http://localhost:3004/comment/update/user/profile',
                headers: {
                    'Authorization': req.header('Authorization')
                }
            };

            const responseUpdateUserInComment = await axiosRequest(updateUserInComment);

            const getUpdateUserInComment = responseUpdateUserInComment.data;

            if(!getUpdateUserInComment) {
                throw new Error(`Axios in User API failed to execute in Comment API!`)
            }

            const updateUserInDonation = {
                method: 'put',
                url: 'http://localhost:3002/donation/update/user/profile',
                headers: {
                    'Authorization': req.header('Authorization')
                }
            };

            const responseUpdateUserInDonation = await axiosRequest(updateUserInDonation);

            const getUpdateUserInDonation = responseUpdateUserInDonation.data;

            if(!getUpdateUserInDonation) {
                throw new Error(`Axios in User API failed to execute in Donation API`)
            };

            const updateUserInCampaign = {
                method: 'put',
                url: 'http://localhost:3001/campaign/update/user/profile',
                headers: {
                    'Authorization': req.header('Authorization')
                }
            };

            const responseUpdateUserInCampaign = await axiosRequest(updateUserInCampaign);

            const getUpdateUserInCampaign = responseUpdateUserInCampaign.data;

            if(!getUpdateUserInCampaign) {
                throw new Error(`Axios in User API failed to execute in Campaign API`)
            }

            const updateUserInHistory = {
                method: 'put',
                url: 'http://localhost:3001/history/update/user/profile',
                headers: {
                    'Authorization': req.header('Authorization')
                }
            };

            const responseUpdateUserInHistory = await axiosRequest(updateUserInHistory);

            const getUpdateUserInHistory = responseUpdateUserInHistory.data;

            if(!getUpdateUserInHistory) {
                throw new Error(`Axios in User API failed to execute in Campaign API`)
            }

            const updatedUser = await user.findOne({
                where: {
                    id: req.user.dataValues.id
                },
                attributes: ['id', 'name', 'email', 'bank_name', 'bank_account_number', 'profile_image', 'createdAt', 'updatedAt']
            });

            return res.status(200).json({
                message: "Update profile success!",
                data: updatedUser
            });
        } catch (e) {
            return res.status(422).json({
                status: "Error!",
                message: "Update profile failed!"
            });
        };
    };

    async updateProfileImage(req, res) {
        try {
            const body = {
                profile_image: req.file === undefined ? "" : req.file.filename
            };

            const updateImage = await user.update(body, {
                where: {
                    id: req.user.dataValues.id
                }
            });

            const updateUserInComment = {
                method: 'put',
                url: 'http://localhost:3004/comment/update/user/profile',
                headers: {
                    'Authorization': req.header('Authorization')
                }
            };

            const responseUpdateUserInComment = await axiosRequest(updateUserInComment);

            const getUpdateUserInComment = responseUpdateUserInComment.data;

            if(!getUpdateUserInComment) {
                throw new Error(`Axios in User API failed to execute in Comment API!`)
            }

            const updateUserInDonation = {
                method: 'put',
                url: 'http://localhost:3002/donation/update/user/profile',
                headers: {
                    'Authorization': req.header('Authorization')
                }
            };

            const responseUpdateUserInDonation = await axiosRequest(updateUserInDonation);

            const getUpdateUserInDonation = responseUpdateUserInDonation.data;

            if(!getUpdateUserInDonation) {
                throw new Error(`Axios in User API failed to execute in Donation API`)
            };

            const updateUserInCampaign = {
                method: 'put',
                url: 'http://localhost:3001/campaign/update/user/profile',
                headers: {
                    'Authorization': req.header('Authorization')
                }
            };

            const responseUpdateUserInCampaign = await axiosRequest(updateUserInCampaign);

            const getUpdateUserInCampaign = responseUpdateUserInCampaign.data;

            if(!getUpdateUserInCampaign) {
                throw new Error(`Axios in User API failed to execute in Campaign API`)
            }

            const updateUserInHistory = {
                method: 'put',
                url: 'http://localhost:3001/history/update/user/profile',
                headers: {
                    'Authorization': req.header('Authorization')
                }
            };

            const responseUpdateUserInHistory = await axiosRequest(updateUserInHistory);

            const getUpdateUserInHistory = responseUpdateUserInHistory.data;

            if(!getUpdateUserInHistory) {
                throw new Error(`Axios in User API failed to execute in Campaign API`)
            }

            const updatedUser = await user.findOne({
                where: {
                    id: req.user.dataValues.id
                },
                attributes: ['id', 'name', 'email', 'bank_name', 'bank_account_number', 'profile_image', 'createdAt', 'updatedAt']
            });

            return res.status(200).json({
                message: "Update profile image success!",
                data: updatedUser
            });
        } catch (e) {
            return res.status(422).json({
                status: "Error!",
                message: "Update profile image failed!"
            })
        };
    };

    async updateEmail(req, res) {
        try {
            const body = {
                email: req.body.email
            };

            const updateUserEmail = await user.update(body, {
                where: {
                    id: req.user.dataValues.id
                }
            });

            const updateUserInComment = {
                method: 'put',
                url: 'http://localhost:3004/comment/update/user/profile',
                headers: {
                    'Authorization': req.header('Authorization')
                }
            };

            const responseUpdateUserInComment = await axiosRequest(updateUserInComment);

            const getUpdateUserInComment = responseUpdateUserInComment.data;

            if(!getUpdateUserInComment) {
                throw new Error(`Axios in User API failed to execute in Comment API!`)
            }

            const updateUserInDonation = {
                method: 'put',
                url: 'http://localhost:3002/donation/update/user/profile',
                headers: {
                    'Authorization': req.header('Authorization')
                }
            };

            const responseUpdateUserInDonation = await axiosRequest(updateUserInDonation);

            const getUpdateUserInDonation = responseUpdateUserInDonation.data;

            if(!getUpdateUserInDonation) {
                throw new Error(`Axios in User API failed to execute in Donation API`)
            };

            const updateUserInCampaign = {
                method: 'put',
                url: 'http://localhost:3001/campaign/update/user/profile',
                headers: {
                    'Authorization': req.header('Authorization')
                }
            };

            const responseUpdateUserInCampaign = await axiosRequest(updateUserInCampaign);

            const getUpdateUserInCampaign = responseUpdateUserInCampaign.data;

            if(!getUpdateUserInCampaign) {
                throw new Error(`Axios in User API failed to execute in Campaign API`)
            }

            const updateUserInHistory = {
                method: 'put',
                url: 'http://localhost:3001/history/update/user/profile',
                headers: {
                    'Authorization': req.header('Authorization')
                }
            };

            const responseUpdateUserInHistory = await axiosRequest(updateUserInHistory);

            const getUpdateUserInHistory = responseUpdateUserInHistory.data;

            if(!getUpdateUserInHistory) {
                throw new Error(`Axios in User API failed to execute in Campaign API`)
            }

            const updatedUserEmail = await user.findOne({
                where: {
                    id: req.user.dataValues.id
                },
                attributes: ['id', 'name', 'email', 'bank_name', 'bank_account_number', 'profile_image', 'createdAt', 'updatedAt']
            });

            return res.status(200).json({
                message: "Update user email success!",
                data: updatedUserEmail
            });
        } catch (e) {
            return res.status(422).json({
                status: "Error!",
                message: "Update user email failed!"
            });
        };
    }

    async updatePassword(req, res) {
        try {
            const body = {
                password: req.body.password
            };

            const updateUserPassword = await user.update(body, {
                where: {
                    id: req.user.dataValues.id
                }
            });

            const updatedUser = await user.findOne({
                where: {
                    id: req.user.dataValues.id
                },
                attributes: ['id', 'name', 'email', 'bank_name', 'bank_account_number', 'profile_image', 'createdAt', 'updatedAt']
            });

            return res.status(200).json({
                message: "Update user password success!",
                data: updatedUser
            });
        } catch (e) {
            return res.status(422).json({
                status: "Error!",
                message: "Update user password failed!"
            })
        };
    };

    async deleteProfile(req, res) {
        try {
            const deleteUser = await user.destroy({
                where: {
                    id: req.user.dataValues.id
                }
            });

            return res.status(200).json({
                message: "User delete success!",
                data: null
            });
        } catch (e) {
            return res.status(422).json({
                status: "Error!",
                message: "User delete failed!"
            });
        };
    };
};

module.exports = new UserController;