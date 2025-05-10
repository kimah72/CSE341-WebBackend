require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { initDb } = require("./database");
const app = express();
const port = process.env.PORT || 3000;

// Initialize database
initDb((err) => {
  if (err) {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  }
  app.use(bodyParser.json());
  app.use("/", require("./routes"));

  app.listen(port, () => {
    console.log(`Running on port ${port}`);
  });
});
