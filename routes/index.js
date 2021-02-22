const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const passport = require("passport");
// const ssrsController = require('../controllers/ssrs');

router.get("/", function(req, res) {
    // res.send("hi there you!");
    res.render("landing")
});

router.post(
    "/",
    bodyParser.urlencoded({ extended: false }),
    passport.authenticate("saml", { failureRedirect: "/", failureFlash: true }),
    function (req, res) {
        let test = req.session.passport.user
        res.redirect("/");
    }
);

router.get('/login',
passport.authenticate('saml',
  {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

router.get('/logout', function (req, res) {
  req.logout();
  // TODO: invalidate session on IP
  res.redirect('/');
});


module.exports = router;