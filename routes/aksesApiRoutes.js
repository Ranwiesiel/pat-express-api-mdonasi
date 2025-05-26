const express = require('express');
const router = express.Router();
const AksesApiModel = require('../models/aksesApi');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const { successResponse, errorResponse } = require('../utils/validation');

// GET /api/akses-api - Mendapatkan riwayat akses API (Admin only)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const method = req.query.method;
    const status_code = req.query.status_code ? parseInt(req.query.status_code) : null;

    const result = await AksesApiModel.getAll(page, limit, method, status_code);
    res.status(200).json(successResponse('Riwayat akses API berhasil diambil', result.data, result.pagination));
  } catch (error) {
    console.error('Error getting akses API:', error);
    res.status(500).json(errorResponse('Terjadi kesalahan server'));
  }
});

module.exports = router;
