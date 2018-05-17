const express = require('express');
const bodyParser = require("body-parser");
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const path = require('path');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');
// const secret = require('./secret/secret');
const app = express();

//load routes
const contacts = require('./routes/contacts');
const users = require('./routes/users');

//Passport Config

require('./config/passport')(passport);

//static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


//express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//flash middleware
app.use(flash());

//methodOverride middleware
app.use(methodOverride('_method'));

//global variables
app.use((req,res,next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

mongoose.connect(`mongodb://luiz010:password@ds123500.mlab.com:23500/contacts-node`)
  .then(() => console.log('mongodb Connected!'))
  .catch(err => console.log(err));

  //Index Route
  app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render('index', {
      title
    });
  });

  app.get('/flash', function(req, res){
    // Set a flash message by passing the key, followed by the value, to req.flash().
    req.flash('success_msg', 'Flash is back!')
    res.redirect('/');
  });

//use routes
app.use('/contacts', contacts);
app.use('/user', users);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening on port ${port}`));
