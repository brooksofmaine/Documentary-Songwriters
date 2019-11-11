const router = require('express').Router();
const passport = require('passport');

// auth login
router.get('/login', (req,res) => {
  res.render('login');
});

// auth logout
router.get('/logout', (req,res) => {
  res.send('logging out');
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
  scope: ['profile']
}));

// callback route for google to redirect to
router.get('/google/redirect', (req,res) => {
  res.send("you reached the callback URI, ");
});

module.exports = router;
