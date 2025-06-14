"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
// Debug NODE_ENV
console.log("NODE_ENV:", process.env.NODE_ENV || "undefined");
// Load .env only if explicitly in development or NODE_ENV is unset
if (!process.env.NODE_ENV || process.env.NODE_ENV !== "production") {
    const envPath = path_1.default.resolve(__dirname, ".env");
    console.log("Checking .env at:", envPath);
    if (fs_1.default.existsSync(envPath)) {
        console.log(".env file found");
        console.log("File contents:", fs_1.default.readFileSync(envPath, "utf8"));
    }
    else {
        console.error(".env file not found");
    }
    const result = dotenv_1.default.config({ path: envPath });
    if (result.error) {
        console.error("Dotenv error:", result.error);
    }
    else {
        console.log("Dotenv loaded successfully");
    }
}
console.log("Env variables:", {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    SESSION_SECRET: process.env.SESSION_SECRET,
    MONGODB_URI: process.env.MONGODB_URI ? "Set" : "Undefined",
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5000",
        "https://task-manager-api-9tji.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.set("trust proxy", 1);
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "fallback-secret",
    resave: false,
    saveUninitialized: false,
    store: connect_mongo_1.default.create({
        mongoUrl: process.env.MONGODB_URI,
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
}));
app.use((req, res, next) => {
    console.log("Session:", req.session);
    next();
});
const passport_1 = __importDefault(require("./config/passport"));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
(0, db_1.connectDB)();
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("./swagger.json"));
const errorHandler_1 = require("./middleware/errorHandler");
app.get("/", (_req, res) => {
    res.send(`
    <h1>Welcome to the Task Manager API</h1>
    <p>Explore the API documentation and test endpoints:</p>
    <a href="/api-docs">Go to API Documentation</a>
    <br>
    <a href="/auth/google">Login with Google</a>
  `);
});
app.use("/api", taskRoutes_1.default);
app.use("/api", userRoutes_1.default);
app.use("/auth", authRoutes_1.default);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
app.use(errorHandler_1.errorHandler);
const PORT = parseInt(process.env.PORT || "5000", 10);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
