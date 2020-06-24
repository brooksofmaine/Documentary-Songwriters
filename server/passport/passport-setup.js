/** passport.js and passport strategies **/
const passport = require('passport');
const GoogleStrategy = require ('passport-google-oauth20');
const LocalStrategy = require("passport-local").Strategy;
const RememberMeStrategy = require("passport-remember-me").Strategy;
/** END Passport.js and passport strategies **/

const keys = require('../config/keys');            // google login keys
const token_util = require('./passport-token-utils');       // the util to generate and store the tokens

/** bcrypt, the algorithm to hash the password. **/
let bcrypt = require("bcrypt");
// set number of iterations for the bcrypt algorithm
const bcrypt_num_iterations = process.env.PW_HASH_ITERATIONS || 10;

let db;

/************************************************************
 *  Password Hashing
 ************************************************************/
/*
 * How the password is stored in the database:
 * <login/password_method(google/bcrypt)>:<hashed_password>
 *     if login method is google, the hash and hashed password will be ignored.
 */
// function hashPassword
// used when a new user is registered.
// input: password
// output: the password string stored in the db (in the format stated above)
async function hashPassword(password) {
    if (typeof password !== "string") {
        return null;
    }
    return "bcrypt:" + await bcrypt.hash(password, bcrypt_num_iterations);
}

module.exports.hashPassword = hashPassword;

async function comparePassword(password, hashed) {
    if (typeof password !== "string" || typeof hashed !== "string") {
        return false;
    } else if (hashed === "google") {
        return false;
    }
    const result = hashed.split(":")

    const method = result[0];
    if (method === "bcrypt") {
        return await bcrypt.compare(password, result[1]);
    }
    return false;
}


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
    findUser(username).then(async (userInstance) => {
        if (userInstance === null) {
            console.log("No user");
            return done(null, false, {message: 'Incorrect username.'});
        } else if (!await comparePassword(password, userInstance.password)) {
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

if (keys.google.clientID && keys.google.clientSecret) {
    passport.use(
        'google',
        new GoogleStrategy({
            // options for the google strategy
            callbackURL: '/api/auth/google/redirect',
            clientID: keys.google.clientID,
            clientSecret: keys.google.clientSecret
        }, googleLoginDone)
    );
}


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
    return db.User.scope("withPassword").findByPk(username);
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
        password: "google:null" // We probably don't need this
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
