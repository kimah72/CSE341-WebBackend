const express = require("express");
const router = express.Router();
const { getName } = require("../controllers/index");
const Contact = require("../models/Contact");

router.get("/", getName);

router.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    console.error("Error in GET /contacts:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/contacts", async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "ID query parameter is required" });
    }
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.json(contact);
  } catch (error) {
    console.error("Error in GET /contacts?id:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;