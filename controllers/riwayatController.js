const DonasiModel = require('../models/donasi');

class RiwayatController {
    static async getHistoryByUserId(req, res) {
        try {
            const userId = req.params.userId;
            const riwayat = await DonasiModel.getRiwayatByUserId(userId);
            
            if (riwayat.length === 0) {
            return res.status(404).json(errorResponse(`Riwayat donasi untuk user id ${userId} tidak ditemukan`));
            }
            
            const response = {
            success: true,
            message: 'Riwayat donasi berhasil diambil',
            userid: parseInt(userId),
            data: riwayat
            };
            
            res.status(200).json(response);
        } catch (error) {
            console.error('Error getting riwayat donasi by user ID:', error);
            res.status(500).json(errorResponse('Terjadi kesalahan server'));
        }
    }
}

module.exports = RiwayatController;