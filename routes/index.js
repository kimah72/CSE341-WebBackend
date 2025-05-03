const express = require("express");
const router = express.Router();
const { getName } = require("../controllers/index");
const Contact = require("../models/Contact");

router.get("/", getName);

router.get("/contacts", async (req, res) => {
    try {
      if (Object.keys(req.query).length > 0) {
        // If query parameters exist, handle single contact retrieval
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ error: "ID query parameter is required" });
        }
        const contact = await Contact.findById(id);
        if (!contact) {
          return res.status(404).json({ error: "Contact not found" });
        }
        res.json(contact);
      } else {
        // No query parameters, return all contacts
        const contacts = await Contact.find();
        res.json(contacts);
      }
    } catch (error) {
      console.error("Error in GET /contacts:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

module.exports = router;