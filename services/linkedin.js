const passport = require('passport')
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
var User = require('../models/User');
require('dotenv').config()

passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_KEY,
    clientSecret: process.env.LINKEDIN_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback",
    scope: ['r_emailaddress', 'r_liteprofile'],
}, function(accessToken, refreshToken, profile, done) {
  console.log('profile')
}));