const express = require('express');
const dotenv = require('dotenv');
const AIModelManager = require('./src/services/aiService');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Import routes
const authRoutes = require('./src/api/authRoutes');
const coreRoutes = require('./src/api/coreRoutes');
const adminRoutes = require('./src/api/adminRoutes');

// Basic route for health check
app.get('/', (req, res) => {
  res.send('AI-Powered National Safety App Backend is running!');
});

// Use the API routes
app.use('/api/auth', authRoutes);
app.use('/api', coreRoutes); // Should be protected later
app.use('/api/admin', adminRoutes); // Should be protected later

/**
 * Starts the server after ensuring all necessary services, like the AI model, are initialized.
 */
const startServer = async () => {
  try {
    // Pre-load the AI model before starting the server
    console.log('Initializing AI services...');
    await AIModelManager.getInstance();
    console.log('AI services initialized successfully.');

    // Start listening for requests
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1); // Exit if critical services fail to start
  }
};

// Start the application
startServer();