// app.js
const express = require('express');
const app = express();
require('dotenv').config();

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

// Middleware untuk logging semua akses API
app.use('/api', logApiAccess);

// Import routes
const donasiRoutes = require('./routes/donasiRoutes');
const validasiRoutes = require('./routes/validasiRoutes');
const riwayatRoutes = require('./routes/riwayatRoutes');
const aksesApiRoutes = require('./routes/aksesApiRoutes');

// Setup routes
app.use('/api/donasi', donasiRoutes);
app.use('/api/validasi-donasi', validasiRoutes);
app.use('/api/riwayat-donasi', riwayatRoutes);
app.use('/api/akses-api', aksesApiRoutes);

// Root endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'MDonasi API is running',
    version: '1.0.0',
    endpoints: {
      donasi: '/api/donasi',
      validasi: '/api/validasi-donasi',
      riwayat: '/api/riwayat-donasi',
      akses_api: '/api/akses-api'
    }
  });
});

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
