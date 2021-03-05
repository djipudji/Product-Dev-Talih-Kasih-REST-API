const { admin } = require('../models'),
    passport = require('passport'),
    jwt = require('jsonwebtoken');

class AdminController {
    async signup(user, req, res) {
        try {
            const body = {
                id: user.id,
                email: user.email,
                role: user.role
            };

            const token = jwt.sign({
                user: body
            }, 'secret_password');

            return res.status(200).json({
                message: `Signup success!`,
                token: token
            });
        } catch (e) {
            return res.status(401).json({
                status: `Error!`,
                errros: e
            });
        };
    };

    async login(user, req, res) {
        try {
            const body = {
                id: user.id,
                email: user.email,
                role: user.role
            };

            const token = jwt.sign({
                user: body
            }, 'secret_password');

            return res.status(200).json({
                message: `Login success!`,
                token: token
            });
        } catch (e) {
            return res.status(401).json({
                status: `Error!`,
                errors: e
            });
        };
    };

    async authorization(user, req, res) {
        try {
            return res.status(200).json({
                status: `Success!`,
                message: `Authorized!`,
                user: user
            });
        } catch (e) {
            return res.status(401).json({
                status: `Error!`,
                message: `Unauthorized!`
            });
        };
    };

    async getOne(req, res) {
        try {
            const findUser = await admin.findOne({
                where: {
                    id: req.query.admin_id
                },
                attributes: ['id', 'name', 'email', 'role', 'createdAt']
            });

            return res.status(200).json({
                message: `Success!`,
                data: findUser
            });
        } catch (e) {
            return res.status(422).json({
                status: `Error!`,
                message: `Admin is not exist!`
            })
        };
    };

    async getAll(req, res) {
        try {   
            const findAllUser = await admin.findAll({
                attributes: ['id', 'name', 'email', 'role', 'createdAt'],
                order: [['createdAt', 'ASC']]
            });

            return res.status(200).json({
                message: `Success!`,
                data: findAllUser
            });
        } catch (e) {
            return res.status(422).json({
                status: `Error!`,
                errors: e
            });
        };
    };

    async getOwnProfile(req, res) {
        try {
            const findOwnProfile = await admin.findOne({
                where: {
                    id: req.user.dataValues.id
                },
                attributes: ['id', 'name', 'email', 'role', 'createdAt']
            });

            return res.status(200).json({
                message: `Success!`,
                data: findOwnProfile
            });
        } catch (e) {
            return res.status(422).json({
                status: `Error!`,
                errors: e
            })
        };
    };

    async updateOwnProfile(req, res) {
        try {
            const body = {
                name: req.body.name
            };

            const updateProfile = await admin.update(body, {
                where: {
                    id: req.user.dataValues.id
                }
            });

            const udpatedProfile = await admin.findOne({
                where: {
                    id: req.user.dataValues.id
                },
                attributes: ['id', 'name', 'email', 'role', 'createdAt']
            });

            return res.status(200).json({
                message: `Update profile success!`,
                data: udpatedProfile
            });
        } catch (e) {
            return res.status(422).json({
                status: `Error!`,
                erros: e
            });
        };
    };

    async updateEmail(req, res) {
        try {
            const body = {
                email: req.body.email
            };

            const updateEmail = await admin.update(body,{
                where: {
                    id: req.user.dataValues.id
                }
            });

            const updatedEmail = await admin.findOne({
                where: {
                    id: req.user.dataValues.id
                },
                attributes: ['id', 'name', 'email', 'role', 'createdAt']
            });

            return res.status(200).json({
                message: `Update email success!`,
                data: updatedEmail
            });
        } catch (e) {
            return res.status(422).json({
                status: `Error!`,
                errors: e
            });
        };
    };

    async updatePassword(req, res) {
        try {
            const body = {
                password: req.body.password
            };

            const updatePassword = await admin.update(body, {
                where: {
                    id: req.user.dataValues.id
                }
            });

            const updatedPassword = await admin.findOne({
                where: {
                    id: req.user.dataValues.id
                },
                attributes: ['id', 'name', 'email', 'role', 'createdAt']
            });

            return res.status(200).json({
                message: `Update password success!`,
                data: updatedPassword
            });
        } catch (e) {
            return res.status(422).json({
                status: `Error!`,
                errors: e
            });
        };
    };

    async deleteProfile(req, res) {
        try {
            const deleteProfile = await admin.destroy({
                where: {
                    id: req.user.dataValues.id
                }
            });

            return res.status(200).json({
                message: `Delete profile success!`,
                data: null
            });
        } catch (e) {
            return res.status(422).json({
                status: `Error!`,
                errors: e
            });
        };
    };
};

module.exports = new AdminController;