
let tokens = {};

// function to remove (consume) a token
// taken from https://github.com/jaredhanson/passport-remember-me/
module.exports.consumeRememberMeToken = (token, done) => {
    // notes: passport.js checks if user/token is valid.
    if (token === undefined || token === null) {
        return done("[RememberMe-TokenGen] Error: undefined token");
    }
    let uid = tokens[token];

    // invalidate the single-use token
    delete tokens[token];
    return done(null, uid);
};

// function to save a remember me token
// taken from https://github.com/jaredhanson/passport-remember-me/
module.exports.saveRememberMeToken = (token, uid, done) => {
    if (token === undefined || uid === undefined || token === null || uid === null) {
        return done("[RememberMe-TokenGen] Error: Undefined token or uid when saving token");
    }
    tokens[token] = uid;
    return done();
};

// function to generate a token
// taken from https://github.com/jaredhanson/passport-remember-me/
module.exports.generateToken = (len) => {
    let buf = [];
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charlen = chars.length;

    for (var i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }
    return buf.join('');
};

//  auxiliary func for the func above
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
