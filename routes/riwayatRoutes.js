const express = require('express');
const router = express.Router();
const RiwayatController = require('../controllers/riwayatController');

// GET /api/riwayat-donasi?userId=...&type=...&qty=...&status=...
router.get('/', RiwayatController.getRiwayat);


module.exports = router;
