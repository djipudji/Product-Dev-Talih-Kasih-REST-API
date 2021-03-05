const passport      = require('passport');
const axios         = require('axios');
const https         = require('https');

const JWTstrategy   = require('passport-jwt').Strategy;
const ExtractJWT    = require('passport-jwt').ExtractJwt;

const axiosRequest = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized:false
    })
});

passport.use(
    'user',
    new JWTstrategy({
        secretOrKey: 'secret_password',
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        passReqToCallback:true        
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
                return done (null, false, {
                    message: 'User not found!'
                })
            };

            return done(null, token.user, {
                message: "Authorized!"
            });
        } catch (e) {
            return done(null, false, {
                message: "Unauthorized!"
            })
        }
    }
    )
)

passport.use(
    'admin',
    new JWTstrategy({
        secretOrKey: 'secret_password', // It must be same with secret key when created token
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // It will extract token from req.header('Authorization')
        passReqToCallback: true // Enable req for next step function
      },
      async (req, token, done) => {
        try {
          // Get user info authorization from another service
          let getUser = {
            method: 'get',
            url: 'http://localhost:3005/admin/authorization',
            headers: {
              'Authorization': req.header('Authorization')
            }
          };
  
      
          // Get response for getUser request
          let response = await axiosRequest(getUser);
  
          // Get user data from the response
          let userLogin = response.data.user;
  
          // If user is not found, it will make Unauthorized and make a message
          
          if (!userLogin) {
            return done(null, false, {
              message: 'User not found!'
            })
          };
  
          // If user role is not user, it will make Unauthorized and make a message
  
          // If success, it will return userLogin variable that can be used in the next step
          return done(null, token.user, {
            message: "Authorized!"
          });
        } catch (e) {
          // If error, it will create this message
          return done(null, false, {
            message: "Unauthorized!"
          });
        }
      }
    )
  );