const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('User');

// Routes
app.get('', (req, res) => {
    res.render('index', { title: 'Home Page'})
})

app.get('/about', (req, res) => {
    res.render('about', { title: 'About Page', layout: './layouts/sidebar' })
})

// Showing home page
router.get("/", function (req, res) {
  res.render("home");
});

// Showing secret page
router.get("/secret", isLoggedIn, function (req, res) {
  res.render("secret");
});

// Showing register form
router.get("/register", function (req, res) {
  res.render("register");
});

// Handling user signup
router.post("/register", function (req, res) {
  var username = req.body.username
  var password = req.body.password
  User.register(new User({ username: username }),
          password, function (err, user) {
      if (err) {
          console.log(err);
          return res.render("register");
      }

      passport.authenticate("local")(
          req, res, function () {
          res.render("secret");
      });
  });
});

//Showing login form
router.get("/login", function (req, res) {
  res.render("login");
});

//Handling user login
router.post("/login", passport.authenticate("local", {
  successRedirect: "/secret",
  failureRedirect: "/login"
}), function (req, res) {
});

//Handling user logout
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});


//Check for user auth before showing secret pages
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

module.exports = router;
