const { check, validationResult, matchedData, sanitize } = require('express-validator');
const { user } = require('../../models');

function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}

const multer = require('multer')
const path = require('path')
const crypto = require('crypto')

const uploadDir = '/img/'
const storage = multer.diskStorage({
    destination: './public' + uploadDir,
    filename: function(req, file, cb) {
        crypto.pseudoRandomBytes(16, function(err, raw) {
            if(err) return cb(err)

            cb(null, raw.toString('hex') + path.extname(file.originalname))
        })
    }
})

const upload = multer({
    storage: storage,
    dest: uploadDir,
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
    signup: [
        check('name', 'Name must not be empty!').isString().notEmpty(),
        check('email', 'Email field must be an email address!').normalizeEmail().isEmail(),
        check('email', 'Email is already exist!').custom(value => {
            return user.findOne({
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
            return user.findOne({
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

    loginGoogle: [
        check('name', 'Name must not be empty!').isString().notEmpty(),
        check('email', 'Email field must be an email address!').normalizeEmail().isEmail(),
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

    forgotPassword: [
        check('email', 'Email field must be an email address!').normalizeEmail().isEmail(),
        check('email', 'Email is not exist!').custom(value => {
            return user.findOne({
                where: {
                    email: value
                }
            }).then(result => {
                if(!result) {
                    throw new Error('Email is not exist!')
                }
            })
        }),
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

    forgotPasswordForm: [
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

    getOne: [
        check('user_id', 'User is not exist!').custom(value => {
            return user.findOne({
                where: {
                    id: value
                }
            }).then(result => {
                if(!result) {
                    throw new Error('User is not exist!')
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
        check('bank_name', 'Bank name must not be empty!').isString().notEmpty(),
        check('bank_account_number', 'Bank account number must be a number!').isNumeric(),
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

    updateProfileImage: [
        upload.single('profile_image'),
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
            return user.findOne({
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