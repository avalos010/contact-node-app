const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//load user model
require('../models/user');
const User = mongoose.model('user');

//login route
router.get('/login',(req, res) => {
  res.render('./users/login');
});

//login post router
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/contacts',
    failureRedirect: '/user/login',
    failureFlash: true,
     badRequestMessage: 'Please fill out completely!'
  })(req, res, next);
});

//sign up route
router.get('/register',(req, res) => {
  res.render('./users/register');
});

//sign up post route
router.post('/register',(req, res) => {
  let errors = [];
  const email = req.body.email;
  if(req.body.password != req.body.password2) {
    errors.push({
      text: 'Passwords do not match'
    });
  }
  if(req.body.password.length < 6) {
    errors.push({
      text: 'Password must be atleast 6 characters'
    });
  }
  if(errors.length > 0) {
    res.render('users/register', {
      errors,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  }
  else {
    User.findOne({
      email: req.body.email
    })
    .then( user => {
      if(user) {
        req.flash('error_msg', 'Email already taken');
        res.redirect('/user/register');
      }
      else {
        const newUser = new User({
          email: req.body.email,
          password: req.body.password
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save()
            .then(user => {
              req.flash('success_msg', 'Registered Succesfully');
              res.redirect('/user/login');
            })
            .catch(err => console.log(err));
          })
        });
      }
    });
  }
});

//Log out
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/user/login');
});


module.exports = router;
