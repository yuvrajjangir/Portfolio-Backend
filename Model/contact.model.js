const mongoose = require("mongoose");


const contactSchema =  mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
  });
  
  
  const Contact = mongoose.model('contact', contactSchema);
  

  module.exports = {Contact};