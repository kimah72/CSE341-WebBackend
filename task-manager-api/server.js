const path = require('path');
const fs = require('fs');
const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');

// Verify .env exists
const envPath = path.resolve(__dirname, '.env');
console.log('Checking .env at:', envPath);
if (fs.existsSync(envPath)) {
  console.log('.env file found');
  console.log('File contents:', fs.readFileSync(envPath, 'utf8'));
} else {
  console.error('.env file not found');
}

// Load .env
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error('Dotenv error:', result.error);
} else {
  console.log('Dotenv loaded successfully');
}
console.log('Env variables:', {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  SESSION_SECRET: process.env.SESSION_SECRET,
  MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Undefined'
});

// Require passport after env loading
const passport = require('./config/passport');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

const connectDB = require('./config/db');
connectDB();

app.get('/', (req, res) => {
  res.send('Welcome to the Task Manager API');
});

app.use('/api', taskRoutes);
app.use('/api', userRoutes);
app.use('/auth', authRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));