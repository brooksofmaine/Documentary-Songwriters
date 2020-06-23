const router = require('express').Router();
const passport = require('passport');
const googleLoginEnabled = typeof process.env.GOOGLE_CLIENT_ID !== 'undefined';
const token_utils = require('../passport/passport-token-utils');
let client_add = process.env.CLIENT_ADD || process.env.SERVER_ADD || "http://localhost:3000";
const utils = require("./utils");
const ensureAuthenticated = utils.ensureAuthenticated;

// auth logout
router.get('/logout', ensureAuthenticated, (req,res) => {
    req.logout();
    // TODO: detect whether logout is successful
    res.send('Success');
  // handle with passport
});

router.post('/local', passport.authenticate('local'), (req, res) => {
    // don't set remember me cookie only when option not selected
    if (!req.body.remember_me) { 
        res.json({
            "status": "success",
            "user": {
                "username": req.user.username,
                "email": req.user.email,
                "firstName": req.user.firstName,
                "lastName": req.user.lastName
            },
            "remember_me": "false"
        });
        return;
    }

    // set remember me cookie
    let token = token_utils.generateToken(64);
    token_utils.saveRememberMeToken(token, { username: req.user.username }, (err) => {
        // TODO: error handling
        /*if (err) {
            res.status(500);
            return;
        }*/

        res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 31536000000 }); // 365 days
        
        res.json({
            "status": "success",
            "user": {
                "username": req.user.username,
                "email": req.user.email,
                "firstName": req.user.firstName,
                "lastName": req.user.lastName
            },
            "remember_me": "true"
        });
    });
});


// auth with google

if (googleLoginEnabled) {
    router.get('/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

// callback route for google to redirect to
    router.get('/google/redirect',
        passport.authenticate('google', {"failureRedirect": "/google"}),
        (req,res) => {
            var name = req.user.firstName + " " + req.user.lastName;

            res.send("<html><p>Login successful. </p><button onclick='window.close()'>Close Window</button>" +
                "<script>window.onload = () => {" +
                "window.opener.postMessage(\"" + name + "\", \"" + client_add + "\"); window.close()};</script></html>");

        }
    );
}

router.get('/loginstatus', (req, res) => {

    if (typeof req.user !== 'undefined' && req.user !== null) {
        res.json({
            "status": "logged_in",
            "user": {
                "username": req.user.username,
                "email": req.user.email,
                "firstName": req.user.firstName,
                "lastName": req.user.lastName
            }
        });
    } else {
        res.json({"status": "logged_out"});
    }
});

module.exports = router;
module.exports.ensureAuthenticated = ensureAuthenticated;
