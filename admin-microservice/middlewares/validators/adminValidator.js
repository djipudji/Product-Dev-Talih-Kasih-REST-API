const { check, validationResult, matchedData, sanitize } = require('express-validator'),
    { admin } = require('../../models');

function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}

module.exports = {
    signup: [
        check('name', 'Name must not be empty!').isString().notEmpty(),
        check('email', 'Email field must be an email address!').normalizeEmail().isEmail(),
        check('email', 'Email is already exist!').custom(value => {
            return admin.findOne({
                where: {
                    email: value
                }
            }).then(result => {
                if(result) {
                    throw new Error('Email is already exist!')
                }
            })
        }),
        check('password', 'Password field must contains 8 to 32 characters and not contains symbols or spaces!').isString().isLength({
            min: 8,
            max: 32
        }).custom(value => { return !isEmptyOrSpaces(value) }),
        check('passwordConfirmation', 'Password confirmation field must have the same value as the password field!')
        .exists()
        .custom((value, {req}) => value === req.body.password),
        (req, res, next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(422).json({
                    errors: errors.mapped()
                })
            }
            next();
        }
    ],

    login: [
        check('email', 'Email field must be an email address!').normalizeEmail().isEmail(),
        check('email', 'Email is not exist!').custom(value => {
            return admin.findOne({
                where: {
                    email: value
                }
            }).then(result => {
                if(!result) {
                    throw new Error('Email is not exist!')
                }
            })
        }),
        check('password', 'Password field must contains 8 to 32 characters and not contains symbols or spaces').isString().isLength({
            min: 8,
            max: 32
        }).custom(value => { return !isEmptyOrSpaces(value) }),
        (req, res, next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(422).json({
                    errors: errors.mapped()
                })
            }
            next();
        }
    ],

    getOne: [
        check('admin_id', 'Admin is not exist!').custom(value => {
            return admin.findOne({
                where: {
                    id: value
                }
            }).then(result => {
                if(!result) {
                    throw new Error('Admin is not exist!')
                }
            })
        }),
        (req, res, next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(422).json({
                    errors: errors.mapped()
                })
            };
            next();
        }
    ],

    updateOwnProfile: [
        check('name', 'Name must not be empty!').isString().notEmpty(),
        (req, res, next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(422).json({
                    errors: errors.mapped()
                })
            };
            next();
        }
    ],

    updateEmail: [
        check('email', 'Email field must be an email address!').normalizeEmail().isEmail(),
        check('email', 'Email is already exist!').custom(value => {
            return admin.findOne({
                where: {
                    email: value
                }
            }).then(result => {
                if (result) {
                    throw new Error('Email is already exist!')
                }
            })
        }),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    errors: errors.mapped()
                })
            };
            next();
        }
    ],

    updatePassword: [
        check('password', 'Password field must contains 8 to 32 characters and not contains symbols or spaces!').isString().isLength({
            min: 8,
            max: 32
        }).custom(value => { return !isEmptyOrSpaces(value) }),
        check('passwordConfirmation', 'Password confirmation field must have the same value as the password field!')
        .exists()
        .custom((value, {req}) => value === req.body.password),
        (req, res, next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(422).json({
                    errors: errors.mapped()
                })
            };
            next();
        }
    ]
}