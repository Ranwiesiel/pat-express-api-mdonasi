const express = require('express');
const router = express.Router();
const ValidasiController = require('../controllers/validasiController')
const { verifyAdmin, verifyVolunteer } = require('../middleware/authMiddleware');


// POST /api/validasi-donasi/:idDonasi - Donatur membuat validasi donasi
router.post('/:idDonasi', ValidasiController.createValidasi);

// PUT /api/validasi-donasi/admin/:idDonasi - Admin memvalidasi donasi
router.put('/admin/:idDonasi', verifyAdmin, ValidasiController.validateDonasiAdmin);

// PUT /api/validasi-donasi/volunteer/:idDonasi - Volunteer memvalidasi donasi
router.put('/volunteer/:idDonasi', verifyVolunteer, ValidasiController.validateDonasiVolunteer);

// GET /api/validasi-donasi/:idDonasi - Mendapatkan detail validasi donasi
router.get('/:idDonasi', ValidasiController.getDetailValidate);

module.exports = router;
