const mongodb = require("../database");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().collection("contacts").find();
    const contacts = await result.toArray();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const getSingle = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .collection("contacts")
      .findOne({ _id: userId });
    if (!result) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return res
        .status(400)
        .json({ error: "First name, last name, and email are required" });
    }

    const contact = { firstName, lastName, email, favoriteColor, birthday };
    const response = await mongodb
      .getDb()
      .collection("contacts")
      .insertOne(contact);

    if (response.acknowledged) {
      res.status(201).json({ id: response.insertedId }); // Return only ID
    } else {
      res.status(500).json({ error: "Failed to create contact" });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
};

const updateContact = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return res
        .status(400)
        .json({ error: "First name, last name, and email are required" });
    }

    const contact = { firstName, lastName, email, favoriteColor, birthday };
    const response = await mongodb
      .getDb()
      .collection("contacts")
      .replaceOne({ _id: userId }, contact);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Contact not found" });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
};

const deleteContact = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .collection("contacts")
      .deleteOne({ _id: userId });

    if (response.deletedCount > 0) {
      res.status(200).send(); // Assignment requires 200
    } else {
      res.status(404).json({ error: "Contact not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact,
};
