const passport = require('passport');
const GoogleStrategy = require ('passport-google-oauth20');
const keys = require('./keys');

let db;

/* ref: https://stackoverflow.com/questions/36486397/ */

passport.use(
    new GoogleStrategy({
        // options for the google strategy
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, loginDone)
);

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

function loginDone (accessToken, refreshToken, profile, done) {
    console.log('passport callback function fired');
    findUserOrCreate(profile.emails[0].value, profile, done);
}

function findUser(username)
{
    console.log(username);
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
