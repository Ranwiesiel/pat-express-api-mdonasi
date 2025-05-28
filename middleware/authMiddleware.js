const BASE_URL = process.env.MODUL1BASE_URL;

// Middleware untuk validasi JWT token
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token is required'
    });
  }

  // Verifikasi token
  try {
  const response = await fetch(
    BASE_URL + "/verify-token", {
    method: 'GET',
    headers: {"Authorization": `Bearer ${token}`}
  });

  const resjson = await response.json();

  if (!response.ok) {
    return res.status(response.status).json({
      success: false,
      message: resjson.message
    });
  }

  req.user = resjson.data; // Store the entire user data, not just role
  next();

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Token verification failed',
      error: error.message
    });
  }
};

// Middleware untuk validasi role admin
const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  next();
};

// Middleware untuk validasi role admin
const verifyVolunteer = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  if (req.user.role !== 'Volunteer') {
    return res.status(403).json({
      success: false,
      message: 'Volunteer access required'
    });
  }

  next();
};

module.exports = { verifyToken, verifyAdmin, verifyVolunteer };
