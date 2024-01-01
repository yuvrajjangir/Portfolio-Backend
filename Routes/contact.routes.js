const {Router} = require("express");
const { Contact } = require("../Model/contact.model");
const contactController = Router();

contactController.post('/submit-contact', async (req, res) => {
    try {
      const { name, email, phone, message } = req.body;
      await Contact.create({name, email, phone, message})
      res.status(200).json({ message: 'Contact information saved successfully!' });
    } catch (error) {
      res.status(500).json({ error: 'Error saving contact information' });
      console.log(error);
    }
  });

  module.exports = {contactController};