const express = require("express");
const model = require("../Model/contact.model");
const router = express.Router();


router.post('/submit-contact', async (req, res) => {
    try {
      const { name, email, phone, message } = req.body;
      const newContact = new model({ name, email, phone, message });
      await newContact.save();
      res.status(200).json({ message: 'Contact information saved successfully!' });
    } catch (error) {
      res.status(500).json({ error: 'Error saving contact information' });
      console.log(error);
    }
  });

  module.exports = router;