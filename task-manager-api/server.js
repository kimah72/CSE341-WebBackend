const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('../config/passport');
const taskRoutes = require('./routes/taskManager');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
const app = express();
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
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