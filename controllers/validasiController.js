const ValidasiDonasiModel = require('../models/validasiDonasi');
const DonasiModel = require('../models/donasi');

const { 
    validateValidasiInput, 
    validateAdminValidasiInput,
    validateVolunteerValidasiInput,
    successResponse, 
    errorResponse 
} = require('../utils/validation');

class ValidasiController {    static async createValidasi(req, res) {
        try {
            const idDonasi = req.body.id_donasi;
            
            if (!idDonasi) {
                return res.status(400).json(errorResponse('id_donasi harus disertakan dalam request body'));
            }
            
            // Cek apakah donasi exists
            const donasi = await DonasiModel.getById(idDonasi);
            if (!donasi) {
                return res.status(404).json(errorResponse(`Donasi dengan id ${idDonasi} tidak ditemukan`));
            }

            const errors = validateValidasiInput(req.body);
            if (errors.length > 0) {
                return res.status(400).json(errorResponse('Data validasi tidak lengkap', errors));
            }

            const validasiData = {
            id_donasi: idDonasi,
            bukti_pembayaran: req.body.bukti_pembayaran || '',
            catatan_validasi: req.body.catatan_validasi || ''
            };

            const validasiId = await ValidasiDonasiModel.create(validasiData);
            const validasi = await ValidasiDonasiModel.getById(validasiId);
            
            res.status(201).json(successResponse('Validasi donasi berhasil dibuat', validasi));
        } catch (error) {
            if (error.message === 'Validasi untuk donasi ini sudah ada') {
                return res.status(400).json(errorResponse(error.message));
            }
            console.error('Error creating validasi:', error);
            res.status(500).json(errorResponse('Terjadi kesalahan server'));
        }
    }    static async validateDonasiAdmin(req, res) {
        try {
            const idDonasi = req.body.id_donasi;
            
            if (!idDonasi) {
                return res.status(400).json(errorResponse('id_donasi harus disertakan dalam request body'));
            }
            
            // Cek apakah donasi exists
            const donasi = await DonasiModel.getById(idDonasi);
            if (!donasi) {
                return res.status(404).json(errorResponse(`Donasi dengan id ${idDonasi} tidak ditemukan`));
            }

            const errors = validateAdminValidasiInput(req.body);
            if (errors.length > 0) {
                return res.status(400).json(errorResponse('Data validasi tidak lengkap', errors));
            }

            const updated = await ValidasiDonasiModel.updateByAdmin(idDonasi, req.body);
            if (updated) {
                const validasi = await ValidasiDonasiModel.getByDonasiId(idDonasi);
                res.status(200).json(successResponse('Berhasil divalidasi', validasi));
            } else {
                res.status(404).json(errorResponse('Validasi donasi tidak ditemukan'));
            }
        } catch (error) {
            console.error('Error updating validasi by admin:', error);
            res.status(500).json(errorResponse('Terjadi kesalahan server'));
        }
    }    static async validateDonasiVolunteer(req, res) {
        try {
            const idDonasi = req.body.id_donasi;
            
            if (!idDonasi) {
                return res.status(400).json(errorResponse('id_donasi harus disertakan dalam request body'));
            }
            
            // Cek apakah donasi exists
            const donasi = await DonasiModel.getById(idDonasi);
            if (!donasi) {
                return res.status(404).json(errorResponse(`Donasi dengan id ${idDonasi} tidak ditemukan`));
            }

            const errors = validateVolunteerValidasiInput(req.body);
            if (errors.length > 0) {
                return res.status(400).json(errorResponse('Data validasi tidak lengkap', errors));
            }

            const updated = await ValidasiDonasiModel.updateByAdmin(idDonasi, req.body);
            if (updated) {
                const validasi = await ValidasiDonasiModel.getByDonasiId(idDonasi);
                res.status(200).json(successResponse('Berhasil divalidasi', validasi));
            } else {
                res.status(404).json(errorResponse('Validasi donasi tidak ditemukan'));
            }
        } catch (error) {
            console.error('Error updating validasi by volunteer:', error);
            res.status(500).json(errorResponse('Terjadi kesalahan server'));
        }
    }   
    
     static async createValidasiService(donasiId) {
        try {
            const validasiData = {
                id_donasi: donasiId,
                bukti_pembayaran: '', 
                catatan_validasi: '' 
            };

            await ValidasiDonasiModel.create(validasiData);
        } catch (error) {
            console.error('Error creating validasi service:', error);
            throw error; // Let the caller handle the error
        }
    }

    static async getDetailValidate(req, res) {
        try {
            const idDonasi = req.body.id_donasi;
            
            if (!idDonasi) {
                return res.status(400).json(errorResponse('id_donasi harus disertakan dalam request body'));
            }
            
            const validasi = await ValidasiDonasiModel.getByDonasiId(idDonasi);
            
            if (!validasi) {
                return res.status(404).json(errorResponse(`Validasi donasi dengan id donasi ${idDonasi} tidak ditemukan`));
            }
            
            res.status(200).json(successResponse('Detail validasi donasi berhasil ditemukan', validasi));
        } catch (error) {
            console.error('Error getting validasi by donasi ID:', error);
            res.status(500).json(errorResponse('Terjadi kesalahan server'));
        }
    }
}

module.exports = ValidasiController;