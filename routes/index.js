const express = require("express");
const router = express.Router();
const { getData } = require("../controllers/index");
const Contact = require("../models/Contact");

router.get("/", getData);

// Get all contacts
router.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create a contact
router.post("/contacts", async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const contact = new Contact({ firstName, lastName, email });
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;