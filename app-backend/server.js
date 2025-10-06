const express = require('express');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const authRoutes = require('./src/api/authRoutes');

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const coreRoutes = require('./src/api/coreRoutes');

// Use the authentication routes
app.use('/api/auth', authRoutes);

const adminRoutes = require('./src/api/adminRoutes');

// Protected core routes
app.use('/api', coreRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
