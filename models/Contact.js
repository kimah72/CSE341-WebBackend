const mongoose = require("mongoose")
const contactSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("Contact", contactSchema);
