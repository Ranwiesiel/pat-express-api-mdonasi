const express = require('express');
const router = express.Router();
const RiwayatController = require('../controllers/riwayatController')

// GET /api/riwayat-donasi/:userId - Mendapatkan riwayat donasi berdasarkan user ID
router.get('/:userId', RiwayatController.getHistoryByUserId);

module.exports = router;
