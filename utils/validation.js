// Utility untuk validasi input data
const validateDonasiInput = (data) => {
  const errors = [];
  
  if (!data.userid) {
    errors.push('User ID harus diisi');
  }
  
  if (!data.type) {
    errors.push('Tipe donasi harus diisi');
  } else if (!['money', 'barang'].includes(data.type)) {
    errors.push('Tipe donasi harus "money" atau "barang"');
  }
  
  if (!data.qty) {
    errors.push('Quantity harus diisi');
  } else if (isNaN(data.qty) || data.qty <= 0) {
    errors.push('Quantity harus berupa angka positif');
  }
  
  if (!data.unit) {
    errors.push('Unit harus diisi');
  }
  
  if (!data.keterangan) {
    errors.push('Keterangan harus diisi');
  }
  
  return errors;
};

const validateValidasiInput = (data) => {
  const errors = [];
  
  if (!data.bukti_pembayaran) {
    errors.push('Bukti pembayaran harus diisi');
  }
  
  return errors;
};

const validateAdminValidasiInput = (data) => {
  const errors = [];
  
  if (!data.status_validasi) {
    errors.push('Status validasi harus diisi');
  } else if (!['accepted', 'rejected'].includes(data.status_validasi)) {
    errors.push('Status validasi harus "accepted" atau "rejected"');
  }
  
  if (!data.validator) {
    errors.push('Validator harus diisi');
  }
  
  return errors;
};

// Utility untuk response format yang konsisten
const successResponse = (message, data = null, pagination = null) => {
  const response = {
    success: true,
    message: message
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  if (pagination) {
    response.pagination = pagination;
  }
  
  return response;
};

const errorResponse = (message, errors = null) => {
  const response = {
    success: false,
    message: message
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return response;
};

module.exports = {
  validateDonasiInput,
  validateValidasiInput,
  validateAdminValidasiInput,
  successResponse,
  errorResponse
};
