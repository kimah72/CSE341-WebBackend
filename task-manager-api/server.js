const express = require("express");
const dotenv = require("dotenv");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();
const app = express();
app.use(express.json());

const connectDB = require("./config/db");
connectDB();

// Root route welcome message
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to the Task Manager API</h1>
    <p>Explore the API documentation and test endpoints:</p>
    <a href="/api-docs">Go to API Documentation</a>
  `);
});

app.use("/api", taskRoutes);
app.use("/api", userRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
