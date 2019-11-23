const router = require('express').Router();
const passport = require('passport');
let client_add = "http://localhost:3000";

// function ensureAuthenticated
// ensures the user is logged in before it grants access to the api.
// input: req, the request; res, the response obj; next, the function to be called next
function ensureAuthenticated(req, res, next)
{
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(403).json( {"failure": "you are not logged in"});
    }
}

// auth login
router.get('/login', (req,res) => {
  res.render('login');
});

// auth logout
router.get('/logout', ensureAuthenticated, (req,res) => {
    req.logout();
    // TODO: detect whether logout is successful
    res.send('Success');
  // handle with passport
});

// auth with our own Login
router.get('/local', (req, res) => {
  res.render('ourlogin');
});

// auth with our own signup
router.get('/signup', (req, res) => {
  res.render('signup');
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
      res.send("<html><p>you reached the callback URI. </p><button onclick='window.close()'>Close Window</button>" +
          "<script>window.onload = () => {console.log(\"sending msg\");" +
          "window.opener.postMessage(\"" + name + "\", \"" + client_add + "\");window.close()};</script></html>");
  }
);

router.get('/loginstatus', (req, res) => {
    console.log(req.user);
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
