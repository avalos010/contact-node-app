const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const ContactSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  user: {
    type: String,
    required: true
  }
});

mongoose.model('contact', ContactSchema);
