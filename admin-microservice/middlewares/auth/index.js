const passport = require('passport'),
    localStrategy = require('passport-local').Strategy,
    { admin } = require('../../models'),
    bcrypt = require('bcrypt'),
    JWTstrategy = require('passport-jwt').Strategy,
    ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(
    'signup',
    new localStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            try {
                let createUser = await admin.create({
                    email: email,
                    password: password,
                    name: req.body.name,
                    role: 'admin'
                });

                let newUser = await admin.findOne({
                    where: {
                        id: createUser.id
                    },
                    attributes: ['id', 'email', 'role']
                });

                return done(null, newUser, {
                    message: 'Signup for admin success!'
                });
            } catch (e) {
                return done(null, false, {
                    message: "Admin can't be created!"
                });
            };
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
                let userLogin = await admin.findOne({
                    where: {
                        email: email
                    }
                });

                if (!userLogin) {
                    return done(null, false, {
                        message: "Email not found!"
                    });
                };

                let validate = await bcrypt.compare(password, userLogin.password);

                if (!validate) {
                    return done(null, false, {
                        message: "You put the wrong password!"
                    });
                };

                let userLoginVisible = await admin.findOne({
                    where: {
                        email: email
                    },
                    attributes: ['id', 'email', 'role']
                });

                return done(null, userLoginVisible, {
                    message: 'Login success!'
                });
            } catch (e) {
                return done(null, false, {
                    message: "Can't login!"
                });
            };
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
                let userLogin = await admin.findOne({
                    where: {
                        id: token.user.id
                    },
                    attributes: ['id', 'name', 'email', 'role', 'createdAt']
                });

                if(!userLogin) {
                    return done(null, false, {
                        message: "Email not found!"
                    });
                };

                return done(null, userLogin, {
                    message: "Authorized!"
                });
            } catch (e) {
                return done(null, false, {
                    message: "Unauthorized!"
                });
            };
        }
    )
);