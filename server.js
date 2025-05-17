require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { initDb } = require("./database");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swagger");
const app = express();
const port = process.env.PORT || 3000;

// Initialize database
initDb((err) => {
  if (err) {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  }
  app.use(cors()); // Add CORS middleware
  app.use(bodyParser.json());
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
  app.use("/", require("./routes"));

  app.listen(port, () => {
    console.log(`Running on port ${port}`);
  });
});
