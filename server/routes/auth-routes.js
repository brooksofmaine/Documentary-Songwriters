const router = require('express').Router();
const passport = require('passport');
let client_add = "http://localhost:3000";

// function ensureAuthenticated
// ensures the user is logged in before it grants access to the api.
// input: req, the request; res, the response obj; next, the function to be called next

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(401).json( {"failure": "you are not logged in"});
    }
}

// auth login
router.get('/login', (req,res) => {
  res.send('Success');
});

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
        return next(); 
    }

    // set remember me cookie
    var token = utils.generateToken(64);
    Token.save(token, { userId: req.user.id }, (err) => {
        if (err) { return done(err); }
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
        return next();
    });
});


// auth with google
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
