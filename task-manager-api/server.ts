const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
import express, { Express } from 'express';

// Verify .env exists
const envPath: string = path.resolve(__dirname, '.env');
console.log('Checking .env at:', envPath);
if (!fs.existsSync(envPath)) {
  console.error('.env file not found');
  process.exit(1);
}
console.log('.env file found');
console.log('File contents:', fs.readFileSync(envPath, 'utf8'));

// Load .env
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error('Dotenv error:', result.error);
  process.exit(1);
}
console.log('Dotenv loaded successfully');

// Verify critical env variables
const requiredEnvVars = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'SESSION_SECRET', 'MONGODB_URI'];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  console.error(`Missing environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}
console.log('Env variables:', {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Undefined',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Undefined',
  SESSION_SECRET: process.env.SESSION_SECRET ? 'Set' : 'Undefined',
  MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Undefined'
});

const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const passport = require('./config/passport');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const errorHandler = require('./middleware/errorHandler');

const app: Express = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5000', 'https://task-manager-api-9tji.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.set('trust proxy', 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions',
      ttl: 24 * 60 * 60
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production' ? true : false,
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      path: '/',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
  })
);
app.use((req, res, next) => {
  console.log('Session:', req.session);
  next();
});
app.use(passport.initialize());
app.use(passport.session());

const connectDB = require('./config/db');
connectDB();

app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to the Task Manager API</h1>
    <p>Explore the API documentation and test endpoints:</p>
    <a href="/api-docs">Go to API Documentation</a>
    <br>
    <a href="/auth/google">Login with Google</a>
  `);
});

app.use('/api', taskRoutes);
app.use('/api', userRoutes);
app.use('/auth', authRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorHandler);

const PORT: number = parseInt(process.env.PORT || '5000', 10);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));