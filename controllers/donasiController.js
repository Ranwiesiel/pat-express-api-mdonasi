const DonasiModel = require('../models/donasi');
const { 
  validateDonasiInput, 
  successResponse, 
  errorResponse 
} = require('../utils/validation');

class DonasiController {
    static async getDonasi(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const status = req.query.status;

            const result = await DonasiModel.getAll(page, limit, status);
            res.status(200).json(successResponse('Daftar donasi', result.data, result.pagination));
        } catch (error) {
            console.error('Error getting donasi:', error);
            res.status(500).json(errorResponse('Terjadi kesalahan server'));
        }
    }

    static async createDonasi(req, res) {
        try {
            const errors = validateDonasiInput(req.body);
            if (errors.length > 0) {
            return res.status(400).json(errorResponse('Data donasi tidak lengkap', errors));
            }

            const donasiId = await DonasiModel.create(req.body);
            const donasi = await DonasiModel.getById(donasiId);
            
            res.status(201).json(successResponse('Donasi berhasil dibuat', donasi));
        } catch (error) {
            console.error('Error creating donasi:', error);
            res.status(500).json(errorResponse('Terjadi kesalahan server'));
        }
    }

    static async getDonasiByUserId(req, res) {
        try {
            const donasi = await DonasiModel.getByUserId(req.params.userId);
            
            if (donasi.length === 0) {
            return res.status(404).json(errorResponse(`Donasi dengan user id ${req.params.userId} tidak ditemukan`));
            }
            
            res.status(200).json(successResponse('Donasi berhasil ditemukan', donasi));
        } catch (error) {
            console.error('Error getting donasi by user ID:', error);
            res.status(500).json(errorResponse('Terjadi kesalahan server'));
        }
    }

    static async getDonasiHistory(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const result = await DonasiModel.getRiwayatAdmin(page, limit);
            res.status(200).json(successResponse('Riwayat donasi berhasil diambil', result.data, result.pagination));
        } catch (error) {
            console.error('Error getting riwayat donasi admin:', error);
            res.status(500).json(errorResponse('Terjadi kesalahan server'));
        }
    }

    static async getDonasiById(req, res) {
        try {
            const donasi = await DonasiModel.getById(req.params.id);
            
            if (!donasi) {
            return res.status(404).json(errorResponse(`Donasi dengan id ${req.params.id} tidak ditemukan`));
            }
            
            res.status(200).json(successResponse('Donasi berhasil ditemukan', donasi));
        } catch (error) {
            console.error('Error getting donasi by ID:', error);
            res.status(500).json(errorResponse('Terjadi kesalahan server'));
        }
    }

    static async getDonasiByStatus(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const status = req.params.status;

            const result = await DonasiModel.getByStatus(status, page, limit);
            res.status(200).json(successResponse(`Daftar donasi dengan status ${status}`, result.data, result.pagination));
        } catch (error) {
            console.error('Error getting donasi by status:', error);
            res.status(500).json(errorResponse('Terjadi kesalahan server'));
        }
    }

    static async getDonasiByType(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const type = req.params.type;
            const result = await DonasiModel.getByType(type, page, limit);
            res.status(200).json(successResponse(`Daftar donasi dengan tipe ${type}`, result.data, result.pagination));
        } catch (error) {
            console.error('Error getting donasi by type:', error);
            res.status(500).json(errorResponse('Terjadi kesalahan server'));
        }
    }

    static async editDonasi(req, res) {
        try {
            const errors = validateDonasiInput(req.body);
            if (errors.length > 0) {
            return res.status(400).json(errorResponse('Data donasi tidak lengkap', errors));
            }

            const existing = await DonasiModel.getById(req.params.id);
            if (!existing) {
            return res.status(404).json(errorResponse(`Donasi dengan id ${req.params.id} tidak ditemukan`));
            }

            const updated = await DonasiModel.update(req.params.id, req.body);
            if (updated) {
            const donasi = await DonasiModel.getById(req.params.id);
            res.status(200).json(successResponse('Donasi berhasil diubah', donasi));
            } else {
            res.status(500).json(errorResponse('Gagal mengubah donasi'));
            }
        } catch (error) {
            console.error('Error updating donasi:', error);
            res.status(500).json(errorResponse('Terjadi kesalahan server'));
        }
    }

    static async deleteDonasi(req, res) {
        try {
            const existing = await DonasiModel.getById(req.params.id);
            if (!existing) {
            return res.status(404).json(errorResponse(`Donasi dengan id ${req.params.id} tidak ditemukan`));
            }

            const deleted = await DonasiModel.delete(req.params.id);
            if (deleted) {
            res.status(200).json(successResponse('Donasi berhasil dihapus'));
            } else {
            res.status(500).json(errorResponse('Gagal menghapus donasi'));
            }
        } catch (error) {
            console.error('Error deleting donasi:', error);
            res.status(500).json(errorResponse('Terjadi kesalahan server'));  }
    }
}

module.exports = DonasiController;