import path from "path";
import fs from "fs";
import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import { connectDB } from "./config/db";

// Verify .env exists
const envPath: string = path.resolve(__dirname, ".env");
console.log("Checking .env at:", envPath);
if (fs.existsSync(envPath)) {
  console.log(".env file found");
  console.log("File contents:", fs.readFileSync(envPath, "utf8"));
} else {
  console.error(".env file not found");
}

// Load .env
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error("Dotenv error:", result.error);
} else {
  console.log("Dotenv loaded successfully");
}
console.log("Env variables:", {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  SESSION_SECRET: process.env.SESSION_SECRET,
  MONGODB_URI: process.env.MONGODB_URI ? "Set" : "Undefined",
});

// Initialize app after .env
const app: Express = express();
app.use(express.json());

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5000",
      "https://task-manager-api-9tji.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Session and Passport
app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI as string,
      collectionName: "sessions",
      ttl: 24 * 60 * 60,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production" ? true : false,
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      path: "/",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("Session:", req.session);
  next();
});

// Load Passport after .env
import passport from "./config/passport";
app.use(passport.initialize());
app.use(passport.session());

// Connect DB
connectDB();

// Routes
import taskRoutes from "./routes/taskRoutes";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
import { errorHandler } from "./middleware/errorHandler";

app.get("/", (_req: Request, res: Response) => {
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

const PORT: number = parseInt(process.env.PORT || "5000", 10);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));