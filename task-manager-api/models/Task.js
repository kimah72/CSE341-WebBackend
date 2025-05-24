const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Title is required"] },
  description: { type: String },
  status: {
    type: String,
    enum: {
      values: ["pending", "completed"],
      message: "{VALUE} is not a valid status",
    },
    default: "pending",
  },
  dueDate: { type: Date },
});

module.exports = mongoose.model("Task", taskSchema);
