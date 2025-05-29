-- Script SQL untuk membuat database dan tabel MDonasi
-- Jalankan script ini di database MySQL Anda

-- Membuat database (opsional, jika belum ada)
-- CREATE DATABASE IF NOT EXISTS mdonasi_db;
-- USE mdonasi_db;

-- Tabel tb_donasi
CREATE TABLE IF NOT EXISTS tb_donasi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userid INT (11) NOT NULL,
    type ENUM('uang', 'barang') NOT NULL,
    qty INT NOT NULL,
    unit VARCHAR(100) NOT NULL,
    keterangan VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_userid (userid),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at)
);

-- Tabel tb_validasi_donasi
CREATE TABLE IF NOT EXISTS tb_validasi_donasi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_donasi INT NOT NULL,
    bukti_pembayaran VARCHAR(255),
    catatan_validasi TEXT,
    status ENUM('need_validation', 'pending', 'accepted', 'rejected', 'taken') DEFAULT 'need_validation',
    validator VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_donasi) REFERENCES tb_donasi(id) ON DELETE CASCADE,
    INDEX idx_id_donasi (id_donasi),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Tabel tb_akses_api
CREATE TABLE IF NOT EXISTS tb_akses_api (
    id INT AUTO_INCREMENT PRIMARY KEY,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    ip_address VARCHAR(50),
    user_agent VARCHAR(255),
    status_code INT,
    response_time INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_endpoint (endpoint),
    INDEX idx_method (method),
    INDEX idx_status_code (status_code),
    INDEX idx_created_at (created_at)
);

-- Insert sample data (opsional)
-- INSERT INTO tb_donasi (userid, type, qty, unit, keterangan) VALUES
-- ('user001', 'money', 100000, 'rupiah', 'Semoga bermanfaat'),
-- ('user002', 'barang', 10, 'dus', 'Baju, celana, selimut');

-- INSERT INTO tb_validasi_donasi (id_donasi, bukti_pembayaran, catatan_validasi, status) VALUES
-- (1, 'https://example.com/bukti1.jpg', 'Pembayaran sudah masuk', 'pending'),
-- (2, 'https://example.com/bukti2.jpg', 'Barang sudah disiapkan', 'accepted');
