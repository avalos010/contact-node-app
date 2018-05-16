const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = mongoose.model('user');

module.exports = passport => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (email, password, done) => {
    User.findOne({
      email
    }, (err, user) => {
      if (err) throw error;
      if (!user) {
        return done(null, false, {
          message: 'User Not found'
        });
      }

      //match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        }
        else {
          return done(null, false, {message: 'Password incorrect'});
        }
      });

      passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      passport.deserializeUser((id, done) => {
        User.findById(id,(err, user) => done(err, user));
      });
    });
  }))
}
