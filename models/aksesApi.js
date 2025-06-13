const { pool } = require('../config/db');

class AksesApiModel {
  // Mendapatkan riwayat akses API dengan filter dan pagination
  static async getAll(page = 1, limit = 10, method = null, status_code = null) {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM tb_akses_api WHERE 1=1';
    let queryParams = [];

    if (method) {
      query += ' AND method = ?';
      queryParams.push(method);
    }

    if (status_code) {
      query += ' AND status_code = ?';
      queryParams.push(status_code);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    const [rows] = await pool.execute(query, queryParams);

    // Count total untuk pagination
    let countQuery = 'SELECT COUNT(*) as total FROM tb_akses_api WHERE 1=1';
    let countParams = [];
    
    if (method) {
      countQuery += ' AND method = ?';
      countParams.push(method);
    }

    if (status_code) {
      countQuery += ' AND status_code = ?';
      countParams.push(status_code);
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

  // Menyimpan log akses API baru dalam tabel
  static async create(aksesData) {
    const { endpoint, method, ip_address, user_agent, status_code, response_time } = aksesData;
    const query = `
      INSERT INTO tb_akses_api (endpoint, method, ip_address, user_agent, status_code, response_time, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    
    const [result] = await pool.execute(query, [endpoint, method, ip_address, user_agent, status_code, response_time]);
    return result.insertId;
  }
}

module.exports = AksesApiModel;
