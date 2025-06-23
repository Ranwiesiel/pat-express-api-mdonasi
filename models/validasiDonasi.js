const { pool } = require('../config/db');

class ValidasiDonasiModel {
  // Membuat validasi donasi baru oleh donatur
  static async create(validasiData) {
    const { id_donasi, bukti_pembayaran, catatan_validasi } = validasiData;
    
    // Cek apakah validasi sudah ada untuk donasi ini
    const existingQuery = 'SELECT id FROM tb_validasi_donasi WHERE id_donasi = ?';
    const [existing] = await pool.execute(existingQuery, [id_donasi]);
    
    if (existing.length > 0) {
      throw new Error('Validasi untuk donasi ini sudah ada');
    }

    const query = `
      INSERT INTO tb_validasi_donasi (id_donasi, bukti_pembayaran, catatan_validasi, status, created_at, updated_at)
      VALUES (?, ?, ?, 'need_validation', NOW(), NOW())
    `;
    
    const [result] = await pool.execute(query, [id_donasi, bukti_pembayaran, catatan_validasi]);
    return result.insertId;
  }

  // Update validasi oleh admin
  static async updateByAdmin(id_donasi, validasiData) {
    const { status_validasi, catatan_validasi, validator } = validasiData;
    
    const query = `
      UPDATE tb_validasi_donasi 
      SET status = ?, catatan_validasi = ?, validator = ?, updated_at = NOW()
      WHERE id_donasi = ?
    `;
    
    const [result] = await pool.execute(query, [status_validasi, catatan_validasi, validator, id_donasi]);
    return result.affectedRows > 0;
  }

  static async kirimBukti(id_donasi, validasiData) {
    const { status_validasi, bukti_pembayaran ,catatan_validasi, validator } = validasiData;
    
    const query = `
      UPDATE tb_validasi_donasi 
      SET status = ?, bukti_pembayaran = ?, catatan_validasi = ? , validator = ?, updated_at = NOW()
      WHERE id_donasi = ?
    `;
    
    const [result] = await pool.execute(query, [status_validasi, bukti_pembayaran, catatan_validasi, validator, id_donasi]);
    return result.affectedRows > 0;
  }

  // Mendapatkan detail validasi berdasarkan ID donasi
  static async getByDonasiId(id_donasi) {
    const query = `
      SELECT 
        v.*,
        d.userid, d.type, d.qty, d.unit, d.keterangan, d.created_at as donasi_created_at,
        DATEDIFF(NOW(), d.created_at) as durasi_hari
      FROM tb_validasi_donasi v
      JOIN tb_donasi d ON v.id_donasi = d.id
      WHERE v.id_donasi = ?
    `;
    
    const [rows] = await pool.execute(query, [id_donasi]);
    
    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    return {
      id: row.id,
      id_donasi: row.id_donasi,
      bukti_pembayaran: row.bukti_pembayaran,
      catatan_validasi: row.catatan_validasi,
      status_validasi: row.status,
      validator: row.validator,
      created_at: row.created_at,
      donasi: {
        id: row.id_donasi,
        userid: row.userid,
        type: row.type,
        qty: row.qty,
        unit: row.unit,
        keterangan: row.keterangan,
        status: row.status,
        created_at: row.donasi_created_at,
        durasi_hari: row.durasi_hari
      }
    };
  }

  // Mendapatkan validasi berdasarkan ID
  static async getById(id) {
    const query = 'SELECT * FROM tb_validasi_donasi WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  }
}

module.exports = ValidasiDonasiModel;
