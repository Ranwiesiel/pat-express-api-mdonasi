// app.js
const express = require('express');
const app = express();
require('dotenv').config();

const indexRoutes = require('./routes/indexRoutes');

// Import database connection
const { testConnection } = require('./config/db');

// Import middleware
const { logApiAccess } = require('./middleware/logMiddleware');

const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy untuk mendapatkan IP address yang benar
app.set('trust proxy', true);


app.use('/api', logApiAccess);
app.use('/api', indexRoutes);



// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan server'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan'
  });
});

// Test database connection and start server
const startServer = async () => {
  try {
    await testConnection();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`API Base URL: http://localhost:${port}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
