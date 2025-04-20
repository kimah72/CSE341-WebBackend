require("dotenv").config();
const express = require("express");
const connectDB = require("./database");
const routes = require("./routes/index");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use("/", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});