const express = require('express');
const router = express.Router();
const DonasiController = require('../controllers/donasiController');
const { verifyAdmin } = require('../middleware/authMiddleware');


// GET /api/donasi - Mendapatkan daftar donasi
router.get('/', DonasiController.getDonasi);

// POST /api/donasi - Membuat donasi baru
router.post('/', DonasiController.createDonasi);

// GET /api/donasi/user/:userId - Mendapatkan donasi berdasarkan user ID
router.get('/user/:userId', DonasiController.getDonasiByUserId);


// GET /api/donasi/riwayat-donasi/admin - Mendapatkan semua riwayat donasi (Admin)
router.get('/riwayat-donasi/admin', verifyAdmin, DonasiController.getDonasiHistory);

// GET /api/donasi/:id - Mendapatkan donasi berdasarkan ID
router.get('/:id', DonasiController.getDonasiById);

// GET /api/donasi/status/:status - Mendapatkan donasi berdasarkan status
router.get('/status/:status', DonasiController.getDonasiByStatus);

// GET /api/donasi/type/:type - Mendapatkan donasi berdasarkan tipe
router.get('/type/:type', DonasiController.getDonasiByType);



// PUT /api/donasi/:id - Mengubah data donasi
router.put('/:id', verifyAdmin, DonasiController.editDonasi);

// DELETE /api/donasi/:id - Menghapus donasi
router.delete('/:id', verifyAdmin, DonasiController.deleteDonasi);

module.exports = router;
