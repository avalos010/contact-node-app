const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const {
  ensureAuthenticated
} = require('../helpers/auth');

//load Contact model
require('../models/contact');
const Contact = mongoose.model('contact')



//Contacts list
router.get('/', ensureAuthenticated, (req, res) => {
  const title = "Contacts";
  Contact.find({
    user: req.user.id
  })
    .then(contacts => {
      res.render('contacts', {
        title,
        contacts
      });
    })

})
//edit contact
router.put('/:id', ensureAuthenticated, (req,res) => {
  Contact.findOne({
    _id: req.params.id
  })
  .then(contact  => {
    contact.name = req.body.name,
    contact.number = req.body.number

    contact.save();
  })
  .then(contact => {
    req.flash('success_msg', `contact ${req.body.name} updated`);
    res.redirect('/contacts');
  })
});
//Post Contacts
router.post('/',ensureAuthenticated, (req, res) => {
  let errors = [];

  if (!req.body.name) {
    error.push({
      text: 'Please Add a name'
    });
  } else if (!req.body.number) {
    error.push({
      text: 'Please Add a number'
    });
  }
  if (errors.length > 0) {
    res.render('add', {
      errors,
      name: req.body.name,
      number: req.body.number
    });
  } else {
    new Contact({
        name: req.body.name,
        number: req.body.number,
        user: req.user.id,
      })
      .save()
      .then(contact =>   req.flash('success_msg','Contact Added Succesfully') && res.redirect('/contacts'));
  }
});

//Add Contact
router.get('/add',ensureAuthenticated, (req, res) => {
  res.render('contacts/add');
});

//delete contact
router.delete('/:id',ensureAuthenticated, (req, res) => {
  Contact.remove({
      _id: req.params.id
    })
    .then(() => {
      req.flash('success_msg', 'Contact Removed Succesfully!');
      res.redirect('/contacts');

    })
});

//edit form
router.get('/edit/:id',ensureAuthenticated, (req, res) => {
  Contact.findOne({
      _id: req.params.id
    })
    .then(contact => {
      res.render('./contacts/edit', {
        contact
      })
    })
});

//edit contact
router.put('/:id',ensureAuthenticated, (req, res) => {
  Contact.findOne({
      _id: req.params.id
    })
    .then(contact => {
      contact.name = req.body.name,
        contact.number = req.body.number,

      contact.save()
        .then(req.flash('success_msg', 'Contact Edited Succesfully') && res.redirect('/contacts'))
        .catch(err => console.log(err))
    })
});


//Log out
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/user/login');
});
module.exports = router;
