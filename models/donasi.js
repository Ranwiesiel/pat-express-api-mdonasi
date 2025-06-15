const { pool } = require('../config/db');

class DonasiModel {
  // Membuat donasi baru
  static async create(donasiData) {
    const { userid, type, qty, unit, keterangan } = donasiData;
    const query = `
      INSERT INTO tb_donasi (userid, type, qty, unit, keterangan, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const [result] = await pool.execute(query, [userid, type, qty, unit, keterangan]);
    return result.insertId;
  }

  // Mendapatkan semua donasi dengan pagination
  static async getAll(page = 1, limit = 10, status = null) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT d.*, v.status as status_validasi 
      FROM tb_donasi d 
      LEFT JOIN tb_validasi_donasi v ON d.id = v.id_donasi
    `;
    let queryParams = [];

    if (status) {
      query += ' WHERE v.status = ?';
      queryParams.push(status);
    }

    query += ' ORDER BY d.created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    const [rows] = await pool.execute(query, queryParams);

    // Count total untuk pagination
    let countQuery = 'SELECT COUNT(*) as total FROM tb_donasi d LEFT JOIN tb_validasi_donasi v ON d.id = v.id_donasi';
    let countParams = [];
    
    if (status) {
      countQuery += ' WHERE v.status = ?';
      countParams.push(status);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    return {
      data: rows,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_items: total,
        limit: limit
      }
    };
  }

  // Mendapatkan donasi berdasarkan ID
  static async getById(id) {
    const query = `
      SELECT d.*, v.status as status_validasi 
      FROM tb_donasi d 
      LEFT JOIN tb_validasi_donasi v ON d.id = v.id_donasi 
      WHERE d.id = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  }

  static async getByType(type, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT d.*, v.status as status_validasi 
      FROM tb_donasi d 
      LEFT JOIN tb_validasi_donasi v ON d.id = v.id_donasi 
      WHERE d.type = ? 
      ORDER BY d.created_at DESC 
      LIMIT ? OFFSET ?
    `;
    
    const [rows] = await pool.execute(query, [type, limit, offset]);

    // Count total untuk pagination
    const countQuery = 'SELECT COUNT(*) as total FROM tb_donasi WHERE type = ?';
    const [countResult] = await pool.execute(countQuery, [type]);
    const total = countResult[0].total;

    return {
      data: rows,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_items: total,
        limit: limit
      }
    };
  }

  static async getByStatus(status, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT d.*, v.status as status_validasi 
      FROM tb_donasi d 
      LEFT JOIN tb_validasi_donasi v ON d.id = v.id_donasi 
      WHERE v.status = ? 
      ORDER BY d.created_at DESC 
      LIMIT ? OFFSET ?
    `;
    
    const [rows] = await pool.execute(query, [status, limit, offset]);

    // Count total untuk pagination
    const countQuery = 'SELECT COUNT(*) as total FROM tb_donasi d LEFT JOIN tb_validasi_donasi v ON d.id = v.id_donasi WHERE v.status = ?';
    const [countResult] = await pool.execute(countQuery, [status]);
    const total = countResult[0].total;

    return {
      data: rows,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_items: total,
        limit: limit
      }
    };
  }

  // Mendapatkan donasi berdasarkan user ID
  static async getByUserId(userId) {
    const query = `
      SELECT d.*, v.status as status_validasi 
      FROM tb_donasi d 
      LEFT JOIN tb_validasi_donasi v ON d.id = v.id_donasi 
      WHERE d.userid = ? 
      ORDER BY d.created_at DESC
    `;
    const [rows] = await pool.execute(query, [userId]);
    return rows;
  }

  // Update donasi
  static async update(id, donasiData) {
    const { userid, type, qty, unit, keterangan } = donasiData;
    const query = `
      UPDATE tb_donasi 
      SET userid = ?, type = ?, qty = ?, unit = ?, keterangan = ?, updated_at = NOW()
      WHERE id = ?
    `;
    
    const [result] = await pool.execute(query, [userid, type, qty, unit, keterangan, id]);
    return result.affectedRows > 0;
  }

  // Hapus donasi
  static async delete(id) {
    const query = 'DELETE FROM tb_donasi WHERE id = ?';
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  }

  // Mendapatkan riwayat donasi untuk admin
  static async getRiwayatAdmin(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT 
        d.userid,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', d.id,
            'userid', d.userid,
            'type', d.type,
            'qty', d.qty,
            'unit', d.unit,
            'keterangan', d.keterangan,
            'status', JSON_OBJECT(
              'id', v.id,
              'id_donasi', v.id_donasi,
              'bukti_pembayaran', v.bukti_pembayaran,
              'catatan_validasi', v.catatan_validasi,
              'status_validasi', v.status,
              'validator', v.validator,
              'created_at', v.created_at
            ),
            'created_at', d.created_at
          )
        ) as data
      FROM tb_donasi d 
      LEFT JOIN tb_validasi_donasi v ON d.id = v.id_donasi 
      GROUP BY d.userid
      ORDER BY d.userid
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.execute(query, [limit, offset]);

    // Count total users untuk pagination
    const countQuery = 'SELECT COUNT(DISTINCT userid) as total FROM tb_donasi';
    const [countResult] = await pool.execute(countQuery);
    const total = countResult[0].total;

    return {
      data: rows.map(row => ({
        userid: row.userid,
        data: JSON.parse(row.data)
      })),
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_items: total,
        limit: limit
      }
    };
  }

  // Mendapatkan riwayat donasi berdasarkan user ID
  static async getRiwayatByUserId(userId) {
    const query = `
      SELECT 
        d.*,
        JSON_OBJECT(
          'id', v.id,
          'id_donasi', v.id_donasi,
          'bukti_pembayaran', v.bukti_pembayaran,
          'catatan_validasi', v.catatan_validasi,
          'status_validasi', v.status,
          'validator', v.validator,
          'created_at', v.created_at
        ) as status
      FROM tb_donasi d 
      LEFT JOIN tb_validasi_donasi v ON d.id = v.id_donasi 
      WHERE d.userid = ?
      ORDER BY d.created_at DESC
    `;

    const [rows] = await pool.execute(query, [userId]);
    return rows.map(row => ({
      ...row,
      status: JSON.parse(row.status)
    }));
  }

  // Mendapatkan riwayat donasi berdasarkan type dan qty
  static async getRiwayatByTypeAndQty(type, qty, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT 
        d.*,
        JSON_OBJECT(
          'id', v.id,
          'id_donasi', v.id_donasi,
          'bukti_pembayaran', v.bukti_pembayaran,
          'catatan_validasi', v.catatan_validasi,
          'status_validasi', v.status,
          'validator', v.validator,
          'created_at', v.created_at
        ) as status
      FROM tb_donasi d 
      LEFT JOIN tb_validasi_donasi v ON d.id = v.id_donasi 
      WHERE d.type = ? OR d.qty = ?
      ORDER BY d.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.execute(query, [type, qty, limit, offset]);

    const countQuery = `
      SELECT COUNT(*) as total
      FROM tb_donasi d 
      WHERE d.type = ? OR d.qty = ?
    `;
    const [countResult] = await pool.execute(countQuery, [type, qty]);
    const total = countResult[0].total;

    return {
      data: rows.map(row => ({
        ...row,
        status: row.status ? JSON.parse(row.status) : null
      })),
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_items: total,
        limit: limit
      }
    };
  }

  // Mendapatkan riwayat donasi berdasarkan status validasi
  static async getRiwayatByStatus(status, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT 
        d.*,
        JSON_OBJECT(
          'id', v.id,
          'id_donasi', v.id_donasi,
          'bukti_pembayaran', v.bukti_pembayaran,
          'catatan_validasi', v.catatan_validasi,
          'status_validasi', v.status,
          'validator', v.validator,
          'created_at', v.created_at
        ) as status
      FROM tb_donasi d 
      LEFT JOIN tb_validasi_donasi v ON d.id = v.id_donasi 
      WHERE v.status = ?
      ORDER BY d.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.execute(query, [status, limit, offset]);

    const countQuery = `
      SELECT COUNT(*) as total
      FROM tb_donasi d 
      LEFT JOIN tb_validasi_donasi v ON d.id = v.id_donasi 
      WHERE v.status = ?
    `;
    const [countResult] = await pool.execute(countQuery, [status]);
    const total = countResult[0].total;

    return {
      data: rows.map(row => ({
        ...row,
        status: row.status ? JSON.parse(row.status) : null
      })),
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_items: total,
        limit: limit
      }
    };
  }

}


module.exports = DonasiModel;