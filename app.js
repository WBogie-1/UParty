// Imports
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require("mongoose")
const passport = require("passport")
const bodyParser = require("body-parser")
const localStrategy = require("passport-local")
const User = require("./models/userDetails") //THIS IS WHERE MODEL IS DEFIINED FOR USERS
const session = require('express-session')
const routes = require('./routes/router')

//Setup MongoDB Atlas
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb+srv://ItsToast:Archie2022!@upartycluster.eh8jq.mongodb.net/UPartyDB?retryWrites=true&w=majority");

const app = express()
const port = 5000
app.use(bodyParser.urlencoded({ extended: true }));

// Static Files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))

// Set Templating Engine
app.use(expressLayouts)
app.set('layout', './layouts/full-width')
app.set('view engine', 'ejs')

// Set up session
app.use(
    session({
      secret: "test",
      resave: false,
      saveUninitialized: true,
    })
  );

// Set up passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(
  function(username, password, done) {
    User.findOne({ username: username}, function (err, user) {
      if (err) {return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    })
  }
));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(routes);

// Listen on Port 5000
app.listen(port, () => console.info(`App listening on port ${port}`))