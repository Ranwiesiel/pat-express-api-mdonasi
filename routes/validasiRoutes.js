const express = require('express');
const router = express.Router();
const ValidasiController = require('../controllers/validasiController')
const { verifyAdmin, verifyVolunteer } = require('../middleware/authMiddleware');

//POST hanya dibpakai di backend
router.post('/createvalidasi', ValidasiController.createValidasi);

// PUT /api/validasi-donasi/kirimbukti - Donatur membuat validasi donasi
router.put('/kirimbukti', ValidasiController.kirimBukti);

// PUT /api/validasi-donasi/admin/validasibyadmin - Admin memvalidasi donasi
router.put('/admin/validasibyadmin', verifyAdmin, ValidasiController.validateDonasiAdmin);

// PUT /api/validasi-donasi/volunteer/takedonasi - Volunteer memvalidasi donasi
router.put('/volunteer/takedonasi', verifyVolunteer, ValidasiController.validateDonasiVolunteer);

// GET /api/validasi-donasi/detaildonasi - Mendapatkan detail validasi donasi
router.get('/detaildonasi', ValidasiController.getDetailValidate);

module.exports = router;
