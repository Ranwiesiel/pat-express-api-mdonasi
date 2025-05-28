const express = require('express');
const router = express.Router();

const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const donasiRouter = require('./donasiRoutes');
const riwayatRouter = require('./riwayatRoutes');
const aksesRouter = require('./aksesApiRoutes');
const validasiRouter = require('./validasiRoutes');


// Middleware untuk memverifikasi token sebelum mengakses rute lainnya
router.use(verifyToken);

// Rute untuk donasi
router.use('/donasi', donasiRouter);
router.use('/validasi-donasi', validasiRouter);
router.use('/riwayat-donasi', riwayatRouter);
router.use('/akses-api', verifyAdmin, aksesRouter);

// Root endpoint
router.get('/', (req, res) => {
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

module.exports = router;