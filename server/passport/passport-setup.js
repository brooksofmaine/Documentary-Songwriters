const passport = require('passport');
const GoogleStrategy = require ('passport-google-oauth20');
const LocalStrategy = require("passport-local").Strategy;
const RememberMeStrategy = require("passport-remember-me").Strategy;
const keys = require('../config/keys');
const token_util = require('./passport-token-utils');

let db;

/************************************************************
 *  Local Strategy
 ************************************************************/
passport.use('local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, localAuth));

// authentification strategy for local db auth
// TODO: not storing unencrypted password
function localAuth(username, password, done)
{
    findUser(username).then((userInstance) => {
        if (userInstance === null) {
            console.log("No user");
            return done(null, false, {message: 'Incorrect username.'});
        } else if (userInstance.password !== password) {
            console.log("Wrong passwd");
            return done(null, false, {message: 'Incorrect password.'});
        } else {
            console.log("Success Login");
            return done(null, userInstance.get({ plain: true }));
        }
    }).catch((err) => {
        return done(err);
    });
}


/************************************************************
 *  Google Strategy
 ************************************************************/
/* ref: https://stackoverflow.com/questions/36486397/ */

passport.use(
    'google',
    new GoogleStrategy({
        // options for the google strategy
        callbackURL: '/api/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, googleLoginDone)
);


// Callback function for google login
function googleLoginDone (accessToken, refreshToken, profile, done) {
    console.log('passport callback function fired');
    findUserOrCreate(profile.emails[0].value, profile, done);
}

/************************************************************
 *  RememberMe Strategy
 ************************************************************/
passport.use(new RememberMeStrategy(
  (token, done) => {
      token_util.consumeRememberMeToken(token,  (err, user) => {
          if (err) { return done(err); }
          if (!user) { return done(null, false); }
          return done(null, user);
      });
  },
  (user, done) => {
      let token = token_util.generateToken(64);
      token_util.saveRememberMeToken(token, { username: user.username }, (err) => {
          if (err) { return done(err); }
          return done(null, token);
      });
  }
));

/************************************************************
 *  Helper functions
 ************************************************************/
// In order to help keep authentication state across HTTP requests,
// Sequelize needs to  and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser((user, cb) => {
    cb(null, user.username);
});

passport.deserializeUser((obj, cb) => {
    findUser(obj).then((userInstance) => {
        cb(null, userInstance.get({ plain: true }));
    });
});


function findUser(username)
{
    return db.User.findByPk(username);
}

function findUserOrCreate (username, profile, done)
{
    db.User.findByPk(username).then((userInstance) => {
        if (userInstance === null) {
            createUser(username, profile, done);
        } else {
            return done(null, userInstance.get({ plain: true }));
        }
    }).error((err) => {
        return done(null, null, err);
    });
}

function createUser (username, profile, done)
{
    let createObj = {
        username: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        password: "" // We probably don't need this
    };

    db.User.create(createObj).then((newUserInstance) => {
        console.log(newUserInstance.get({ plain: true }));
        return done(null, newUserInstance.get({ plain: true }));
    }).catch((err) => {
        console.log('Error while retrieving user.');
        console.log(err);
        return done(null, null, err);
    });
}

module.exports.init = (database) => { db = database; };
