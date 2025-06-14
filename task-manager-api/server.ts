import path from 'path';
import dotenv from 'dotenv';
import express, { Express, Request, Response, NextFunction, RequestHandler } from 'express';
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");

// Load .env only in development
if (process.env.NODE_ENV !== 'production') {
  const envPath = path.resolve(__dirname, '.env'); // Root .env for dev
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    console.error('Dotenv error:', result.error);
    process.exit(1); // Exit only in dev if .env fails
  } else {
    console.log('Dotenv loaded successfully');
  }
}

// Log environment variables for debugging
console.log('Env variables:', {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Undefined',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Undefined',
  SESSION_SECRET: process.env.SESSION_SECRET ? 'Set' : 'Undefined',
  MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Undefined',
});

const passport = require("./config/passport");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5000", "https://task-manager-api-9tji.onrender.com"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
      ttl: 24 * 60 * 60 // 24 hours
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production" ? true : false,
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      path: "/",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    }
  })
);
app.use((req, res, next) => {
  console.log("Session:", req.session);
  next();
});
app.use(passport.initialize());
app.use(passport.session());

const connectDB = require("./config/db");
connectDB();

app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to the Task Manager API</h1>
    <p>Explore the API documentation and test endpoints:</p>
    <a href="/api-docs">Go to API Documentation</a>
    <br>
    <a href="/auth/google">Login with Google</a>
  `);
});

app.use("/api", taskRoutes);
app.use("/api", userRoutes);
app.use("/auth", authRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));