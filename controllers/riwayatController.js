const DonasiModel = require('../models/donasi');

class RiwayatController {
  static async getRiwayat(req, res) {
    try {
      const { userId, type, qty, status } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      // Riwayat by userId saja
      if (userId && !type && !qty && !status) {
        const data = await DonasiModel.getRiwayatByUserId(userId);
        return res.status(200).json({
          success: true,
          message: 'Riwayat donasi berdasarkan userId berhasil diambil',
          userid: parseInt(userId),
          data
        });
      }

      // Riwayat by type & qty
      if (type && qty && !status) {
        const result = await DonasiModel.getRiwayatByTypeAndQty(type, parseInt(qty), page, limit);
        return res.status(200).json({
          success: true,
          message: 'Riwayat donasi berdasarkan type dan qty berhasil diambil',
          ...result
        });
      }

      // Riwayat by type & qty
      if ((type || qty) && !status) {
        const result = await DonasiModel.getRiwayatByTypeOrQty(type, parseInt(qty), page, limit);
        return res.status(200).json({
          success: true,
          message: 'Riwayat donasi berdasarkan type atau qty berhasil diambil',
          ...result
        });
      }

      // Riwayat by status
      if (status && !type && !qty) {
        const result = await DonasiModel.getRiwayatByStatus(status, page, limit);
        return res.status(200).json({
          success: true,
          message: 'Riwayat donasi berdasarkan status berhasil diambil',
          ...result
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Parameter pencarian tidak ada dalam database. Gunakan kombinasi: userId, type+qty, atau status.'
      });

    } catch (error) {
      console.error('Error getRiwayat:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server'
      });
    }
  }
}

module.exports = RiwayatController;
