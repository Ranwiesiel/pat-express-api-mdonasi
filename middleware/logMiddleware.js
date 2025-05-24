const { pool } = require('../config/db');

// Middleware untuk logging semua akses API
const logApiAccess = async (req, res, next) => {
  const startTime = Date.now();
  
  // Override res.json untuk capture status code
  const originalJson = res.json;
  
  res.json = function(data) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Log ke database
    logToDB(req, res.statusCode, responseTime);
    
    // Panggil method asli
    return originalJson.call(this, data);
  };
  
  next();
};

// Fungsi untuk menyimpan log ke database
const logToDB = async (req, statusCode, responseTime) => {
  try {
    const endpoint = req.originalUrl;
    const method = req.method;
    const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const userAgent = req.get('User-Agent') || '';
    
    const query = `
      INSERT INTO tb_akses_api (endpoint, method, ip_address, user_agent, status_code, response_time, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    
    await pool.execute(query, [endpoint, method, ipAddress, userAgent, statusCode, responseTime]);
  } catch (error) {
    console.error('Error logging API access:', error);
  }
};

module.exports = { logApiAccess };
