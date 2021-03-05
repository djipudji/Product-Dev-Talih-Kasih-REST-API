const passport = require('passport'),
    axios = require('axios'),
    https = require('https'),
    JWTstrategy = require('passport-jwt').Strategy,
    ExtractJWT = require('passport-jwt').ExtractJwt;

const axiosRequest = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

passport.use(
    'user',
    new JWTstrategy({
            secretOrKey: 'secret_password',
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            passReqToCallback: true
        },
        async (req, token, done) => {
            try {
                let getUser = {
                    method: 'get',
                    url: 'http://localhost:3000/user/authorization',
                    headers: {
                        'Authorization': req.header('Authorization')
                    }
                };

                let response = await axiosRequest(getUser);

                let userLogin = response.data.user;

                if (!userLogin) {
                    return done(null, false, {
                        message: 'User not found!'
                    })
                };

                return done(null, userLogin, {
                    message: 'Authorized!'
                });
            } catch (e) {
                return done(null, false, {
                    message: 'Unauthorized!'
                });
            };
        }
    )
);