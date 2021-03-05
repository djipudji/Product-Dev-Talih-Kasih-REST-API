const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const {
    user
} = require('../../models');
const bcrypt = require('bcrypt');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(
    'signup',
    new localStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            try {
                let createUser = await user.create({
                    email: email,
                    password: password,
                    name: req.body.name
                });

                let newUser = await user.findOne({
                    where: {
                        id: createUser.id
                    },
                    attributes: ['id', 'email']
                });

                return done(null, newUser, {
                    message: "Signup success!"
                });
            } catch (e) {
                return done(null, false, {
                    message: "User can't be created!"
                })
            }
        }
    )
);

passport.use(
    'login',
    new localStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const userLogin = await user.findOne({
                    where: {
                        email: email
                    }
                });

                if (!userLogin) {
                    return done(null, false, {
                        message: 'Email not found!'
                    })
                };

                const validate = await bcrypt.compare(password, userLogin.password);

                if (!validate) {
                    return done(null, false, {
                        message: 'You put the wrong password!'
                    })
                };

                let userLoginVisible = await user.findOne({
                    where: {
                        email: email
                    },
                    attributes: ['id', 'email']
                });

                return done(null, userLoginVisible, {
                    message: 'Login success!'
                });
            } catch (e) {
                return done(null, false, {
                    message: "Can't login!"
                })
            }
        }
    )
);

passport.use(
    'authorization',
    new JWTstrategy({
            secretOrKey: 'secret_password',
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
        },
        async (token, done) => {
            try {
                const userLogin = await user.findOne({
                    where: {
                        id: token.user.id
                    },
                    attributes: ['id', 'name', 'email', 'bank_name', 'bank_account_number', 'profile_image', 'createdAt']
                });

                if (!userLogin) {
                    return done(null, false, {
                        message: "Email not found!"
                    })
                };

                return done(null, userLogin, {
                    message: "Authorized!"
                });
            } catch (e) {
                return done(null, false, {
                    message: "Unauthorized!"
                });
            }
        }
    )
);