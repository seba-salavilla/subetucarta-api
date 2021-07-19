const { GLOBAL } = require('../../config')

const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
//const GoogleStrategy = require('passport-google-oauth20');
const GoogleTokenStrategy = require('passport-google-verify-token').Strategy
const FacebookTokenStrategy = require('passport-facebook-token');
//const bcrypt = require('bcrypt')
const Model = require('../components/auth/models/model');

/**
 * The Google authentication strategy authenticates users using a Google account and OAuth 2.0 tokens. 
 */
passport.use(new GoogleTokenStrategy({
    clientID: '940347259015-aq60m67adkbqvslsfuk8sldt5s2lco56.apps.googleusercontent.com',
    clientSecret: '4vA7PfSn8bZ8hKJPLmSWRxMq'
    },
    async (profile, googleId, done) => {
        const body = {
            name : profile.name,
            email: profile.email,
            googleId :googleId
        }

        let user = await Model.findUserByEmail(body.email);
        if (!user){
            let res = await Model.insertUser(body);
            if(res.error){
                return done(res.error);
            }
            user = res.ops[0]

        }
            

        return done(null, user);
    }
));

/**
 * The Facebook authentication strategy authenticates users using OAuth 2.0 tokens. 
 */
passport.use(new FacebookTokenStrategy({
        clientID: '205974940934666',
        clientSecret: 'd39d73293825fbbfa869d8888f6230a3',
        fbGraphVersion: 'v3.0'
    }, 
    async (accessToken, refreshToken, profile, done) => {
        const body = {
            name : profile.displayName,
            email: profile.emails[0].value,
            facebookId :profile.id
        }

        let user = await Model.findUserByEmail(body.email);
        if (!user){
            let res = await Model.insertUser(body);
            if(res.error){
                return done(res.error);
            }
            user = res.ops[0]

        }

        return done(null, user);
    })
);

/**
 * GOOGLE SESSION STRATEGY JWT
 */

/*passport.use(
    new GoogleStrategy(
      {
        // options for strategy
        callbackURL: 'http://localhost:3000/auth/web/google/redirect',
        clientID: '940347259015-aq60m67adkbqvslsfuk8sldt5s2lco56.apps.googleusercontent.com',
        clientSecret: '4vA7PfSn8bZ8hKJPLmSWRxMq'
      },
        async (accessToken, refreshToken, profile, done) => {
            console.log("NEW GOOGLE STRATEGY")
            console.log(profile)
            console.log(refreshToken)
            console.log(accessToken)
            const body = {
                name : profile.displayName,
                email: profile.emails[0].value,
                googleId :profile.id
            }
            // check if user already exists
            const user = await Model.findUserByEmail(body.email);
            console.log(user)
            if (user) {
                console.log("USUARIO YA EXISTE")
                return done(null, user);
            } else {
                console.log("CREANDO NUEVO USUARIO")
                const newUser = await Model.insertUser(body);
                return done(null, newUser);
            }
        }
    )
);*/

/**
 * USER REGISTRATION
 */
/*passport.use(
    'signup',
    new localStrategy({
        usernameField: 'email',
        passwordField: 'password'},
        async (email, password, done) => {
            try {
                const hash = await bcrypt.hash(password, 10);
                const user = await Model.insertUser({ email, password:hash });
        
                return done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);*/

/**
 * USER LOGIN
 */
passport.use(
    'login',
    new localStrategy({
        usernameField: 'email',passwordField: 'password'},
        async (email, password, done) => {
            try {
                const user = await Model.findUserByEmail(email);
                console.log(user)
                if (!user || user.error) {
                    return done(null, false, { message: 'User not found' });
                }

                const validate = await bcrypt.compare(password, user.password);
        
                if (!validate) {
                    return done(null, false, { message: 'Wrong Password' });
                }

                if (user.disabled){
                    return done(null, false, { message: 'Unauthorized user' });
                }
        
                return done(null, user, { message: 'Logged in Successfully' });
            } catch (error) {
                return done(error);
            }
        }
    )
);


/**
 * HANDLE TOKEN TO SECURE ROUTES
 */
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(
  new JWTstrategy(
    {
      secretOrKey: GLOBAL.TOKEN_KEY,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken('authentication')
    },
    async (token, done) => {
        try {
            let user = await Model.findUserByEmail(token.user.email);
            if (!user || user.error){
                return done(null, false, { message: 'User not found' });
            }

            if (user.disabled){
                return done(null, false, { message: 'User authorization failed ' });
            }
            return done(null, user);
        } catch (error) {
            done(error);
        }
    }
  )
);