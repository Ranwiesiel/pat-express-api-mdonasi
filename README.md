# API Dokumentasi MDonasi

## Deskripsi

API MDonasi adalah layanan API yang memungkinkan pengguna untuk mengelola transaksi donasi digital. API ini menyediakan endpoint untuk membuat, melihat, mengubah, dan menghapus data donasi, serta fitur untuk validasi donasi, riwayat donasi, dan melacak riwayat akses API.

## Base URL

```
http://localhost:3000/api
```

## Database Schema

![Database Schema](./img/database.png)

Dari gambar database diatas, sistem MDonasi terdiri dari beberapa tabel utama:
- **tb_donasi**: Menyimpan data donasi seperti nama donatur, email, nominal, dll
- **tb_validasi_donasi**: Menyimpan data validasi untuk setiap donasi
- **tb_riwayat_donasi**: Mencatat setiap perubahan status donasi
- **tb_akses_api**: Mencatat semua akses ke API

## Endpoints

### Manajemen Donasi

#### 1. Membuat Donasi Baru

- **Method:** POST
- **Path:** `/donasi`
- **Content-Type:** application/json

##### Request Body

```json
{
  "nama_donatur": "Budi Santoso",
  "email": "budi@example.com",
  "nominal": 100000,
  "metode_pembayaran": "transfer_bank",
  "komentar": "Semoga bermanfaat",
  "status": "pending"
}
```

##### Response Success

- **Status Code:** 201 Created
- **Content-Type:** application/json

```json
{
  "success": true,
  "message": "Donasi berhasil dibuat",
  "data": {
    "id": 1,
    "nama_donatur": "Budi Santoso",
    "email": "budi@example.com",
    "nominal": 100000,
    "metode_pembayaran": "transfer_bank",
    "komentar": "Semoga bermanfaat",
    "status": "pending",
    "created_at": "2025-05-21T14:30:00.000Z"
  }
}
```

##### Response Error

- **Status Code:** 400 Bad Request
- **Content-Type:** application/json

```json
{
  "success": false,
  "message": "Data donasi tidak lengkap",
  "errors": [
    "Nama donatur harus diisi",
    "Nominal harus berupa angka"
  ]
}
```

#### 2. Mendapatkan Daftar Donasi

- **Method:** GET
- **Path:** `/donasi`

##### Query Parameters

- `page` (optional): Halaman yang ingin ditampilkan (default: 1)
- `limit` (optional): Jumlah data per halaman (default: 10)
- `status` (optional): Filter berdasarkan status donasi ('pending', 'success', 'failed')

##### Response Success

- **Status Code:** 200 OK
- **Content-Type:** application/json

```json
{
  "success": true,
  "message": "Daftar donasi berhasil diambil",
  "data": [
    {
      "id": 1,
      "nama_donatur": "Budi Santoso",
      "email": "budi@example.com",
      "nominal": 100000,
      "metode_pembayaran": "transfer_bank",
      "komentar": "Semoga bermanfaat",
      "status": "success",
      "created_at": "2025-05-21T14:30:00.000Z"
    },
    {
      "id": 2,
      "nama_donatur": "Siti Rahma",
      "email": "siti@example.com",
      "nominal": 50000,
      "metode_pembayaran": "e-wallet",
      "komentar": "Untuk kebaikan bersama",
      "status": "pending",
      "created_at": "2025-05-21T15:45:00.000Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 47,
    "limit": 10
  }
}
```

#### 3. Mendapatkan Donasi Berdasarkan ID

- **Method:** GET
- **Path:** `/donasi/:id`

##### Response Success

- **Status Code:** 200 OK
- **Content-Type:** application/json

```json
{
  "success": true,
  "message": "Donasi berhasil ditemukan",
  "data": {
    "id": 1,
    "nama_donatur": "Budi Santoso",
    "email": "budi@example.com",
    "nominal": 100000,
    "metode_pembayaran": "transfer_bank",
    "komentar": "Semoga bermanfaat",
    "status": "success",
    "created_at": "2025-05-21T14:30:00.000Z"
  }
}
```

##### Response Error

- **Status Code:** 404 Not Found
- **Content-Type:** application/json

```json
{
  "success": false,
  "message": "Donasi dengan id 999 tidak ditemukan"
}
```

#### 4. Memperbarui Status Donasi

- **Method:** PATCH
- **Path:** `/donasi/:id`
- **Content-Type:** application/json

##### Request Body

```json
{
  "status": "success"
}
```

##### Response Success

- **Status Code:** 200 OK
- **Content-Type:** application/json

```json
{
  "success": true,
  "message": "Status donasi berhasil diperbarui",
  "data": {
    "id": 1,
    "nama_donatur": "Budi Santoso",
    "email": "budi@example.com",
    "nominal": 100000,
    "metode_pembayaran": "transfer_bank",
    "komentar": "Semoga bermanfaat",
    "status": "success",
    "created_at": "2025-05-21T14:30:00.000Z",
    "updated_at": "2025-05-21T16:20:00.000Z"
  }
}
```

#### 5. Menghapus Data Donasi

- **Method:** DELETE
- **Path:** `/donasi/:id`

##### Response Success

- **Status Code:** 200 OK
- **Content-Type:** application/json

```json
{
  "success": true,
  "message": "Donasi berhasil dihapus"
}
```

##### Response Error

- **Status Code:** 404 Not Found
- **Content-Type:** application/json

```json
{
  "success": false,
  "message": "Donasi dengan id 999 tidak ditemukan"
}
```

### Validasi Donasi

#### 1. Membuat Validasi Donasi

- **Method:** POST
- **Path:** `/validasi-donasi`
- **Content-Type:** application/json

##### Request Body

```json
{
  "id_donasi": 1,
  "bukti_pembayaran": "https://example.com/bukti-transfer.jpg",
  "catatan_validasi": "Pembayaran sudah masuk",
  "status_validasi": "valid"
}
```

##### Response Success

- **Status Code:** 201 Created
- **Content-Type:** application/json

```json
{
  "success": true,
  "message": "Validasi donasi berhasil dibuat",
  "data": {
    "id": 1,
    "id_donasi": 1,
    "bukti_pembayaran": "https://example.com/bukti-transfer.jpg",
    "catatan_validasi": "Pembayaran sudah masuk",
    "status_validasi": "valid",
    "validator": "Admin",
    "created_at": "2025-05-21T16:30:00.000Z"
  }
}
```

#### 2. Mendapatkan Daftar Validasi Donasi

- **Method:** GET
- **Path:** `/validasi-donasi`

##### Query Parameters

- `page` (optional): Halaman yang ingin ditampilkan (default: 1)
- `limit` (optional): Jumlah data per halaman (default: 10)
- `status_validasi` (optional): Filter berdasarkan status validasi ('valid', 'invalid', 'pending')

##### Response Success

- **Status Code:** 200 OK
- **Content-Type:** application/json

```json
{
  "success": true,
  "message": "Daftar validasi donasi berhasil diambil",
  "data": [
    {
      "id": 1,
      "id_donasi": 1,
      "bukti_pembayaran": "https://example.com/bukti-transfer.jpg",
      "catatan_validasi": "Pembayaran sudah masuk",
      "status_validasi": "valid",
      "validator": "Admin",
      "created_at": "2025-05-21T16:30:00.000Z"
    },
    {
      "id": 2,
      "id_donasi": 2,
      "bukti_pembayaran": "https://example.com/bukti-transfer2.jpg",
      "catatan_validasi": "Menunggu konfirmasi bank",
      "status_validasi": "pending",
      "validator": "Admin",
      "created_at": "2025-05-21T16:45:00.000Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 3,
    "total_items": 25,
    "limit": 10
  }
}
```

#### 3. Mendapatkan Detail Validasi Donasi

- **Method:** GET
- **Path:** `/validasi-donasi/:id`

##### Response Success

- **Status Code:** 200 OK
- **Content-Type:** application/json

```json
{
  "success": true,
  "message": "Detail validasi donasi berhasil ditemukan",
  "data": {
    "id": 1,
    "id_donasi": 1,
    "bukti_pembayaran": "https://example.com/bukti-transfer.jpg",
    "catatan_validasi": "Pembayaran sudah masuk",
    "status_validasi": "valid",
    "validator": "Admin",
    "created_at": "2025-05-21T16:30:00.000Z",
    "donasi": {
      "id": 1,
      "nama_donatur": "Budi Santoso",
      "email": "budi@example.com",
      "nominal": 100000,
      "metode_pembayaran": "transfer_bank",
      "status": "success"
    }
  }
}
```

#### 4. Memperbarui Status Validasi

- **Method:** PATCH
- **Path:** `/validasi-donasi/:id`
- **Content-Type:** application/json

##### Request Body

```json
{
  "status_validasi": "valid",
  "catatan_validasi": "Pembayaran sudah dikonfirmasi"
}
```

##### Response Success

- **Status Code:** 200 OK
- **Content-Type:** application/json

```json
{
  "success": true,
  "message": "Status validasi berhasil diperbarui",
  "data": {
    "id": 1,
    "id_donasi": 1,
    "bukti_pembayaran": "https://example.com/bukti-transfer.jpg",
    "catatan_validasi": "Pembayaran sudah dikonfirmasi",
    "status_validasi": "valid",
    "validator": "Admin",
    "created_at": "2025-05-21T16:30:00.000Z",
    "updated_at": "2025-05-21T17:20:00.000Z"
  }
}
```

### Riwayat Donasi

#### 1. Mendapatkan Riwayat Donasi

- **Method:** GET
- **Path:** `/riwayat-donasi`

##### Query Parameters

- `page` (optional): Halaman yang ingin ditampilkan (default: 1)
- `limit` (optional): Jumlah data per halaman (default: 10)
- `id_donasi` (optional): Filter riwayat berdasarkan ID donasi

##### Response Success

- **Status Code:** 200 OK
- **Content-Type:** application/json

```json
{
  "success": true,
  "message": "Riwayat donasi berhasil diambil",
  "data": [
    {
      "id": 1,
      "id_donasi": 1,
      "status_sebelumnya": "pending",
      "status_terbaru": "success",
      "keterangan": "Donasi telah divalidasi",
      "created_at": "2025-05-21T17:30:00.000Z"
    },
    {
      "id": 2,
      "id_donasi": 2,
      "status_sebelumnya": "pending",
      "status_terbaru": "failed",
      "keterangan": "Pembayaran tidak valid",
      "created_at": "2025-05-21T17:45:00.000Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 4,
    "total_items": 35,
    "limit": 10
  }
}
```

#### 2. Mendapatkan Riwayat Donasi Berdasarkan ID Donasi

- **Method:** GET
- **Path:** `/riwayat-donasi/donasi/:id_donasi`

##### Response Success

- **Status Code:** 200 OK
- **Content-Type:** application/json

```json
{
  "success": true,
  "message": "Riwayat donasi berhasil diambil",
  "data": [
    {
      "id": 1,
      "id_donasi": 1,
      "status_sebelumnya": "created",
      "status_terbaru": "pending",
      "keterangan": "Donasi telah dibuat",
      "created_at": "2025-05-21T14:30:00.000Z"
    },
    {
      "id": 3,
      "id_donasi": 1,
      "status_sebelumnya": "pending",
      "status_terbaru": "success",
      "keterangan": "Donasi telah divalidasi",
      "created_at": "2025-05-21T17:30:00.000Z"
    }
  ]
}
```

### Riwayat Akses API

#### 1. Mendapatkan Riwayat Akses API

- **Method:** GET
- **Path:** `/akses-api`

##### Query Parameters

- `page` (optional): Halaman yang ingin ditampilkan (default: 1)
- `limit` (optional): Jumlah data per halaman (default: 10)
- `method` (optional): Filter berdasarkan method ('GET', 'POST', 'PATCH', 'DELETE')
- `status_code` (optional): Filter berdasarkan kode status (200, 201, 400, 404, dll)

##### Response Success

- **Status Code:** 200 OK
- **Content-Type:** application/json

```json
{
  "success": true,
  "message": "Riwayat akses API berhasil diambil",
  "data": [
    {
      "id": 1,
      "endpoint": "/api/donasi",
      "method": "POST",
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "status_code": 201,
      "response_time": 120,
      "created_at": "2025-05-21T14:30:00.000Z"
    },
    {
      "id": 2,
      "endpoint": "/api/donasi",
      "method": "GET",
      "ip_address": "192.168.1.2",
      "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      "status_code": 200,
      "response_time": 85,
      "created_at": "2025-05-21T14:35:00.000Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 8,
    "total_items": 78,
    "limit": 10
  }
}
```

## Tampilan CRUD Donasi

![CRUD Donasi](./img/crud-donasi.png)

## Tampilan Validasi Donasi

![Validasi Donasi](./img/validasi-donasi.png)

## Tampilan Riwayat Donasi

![Riwayat Donasi](./img/riwayat-donasi.png)

## Tampilan Riwayat Akses API

![Riwayat Akses API](./img/riwayat-access-api.png)

## Status Kode

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Permintaan berhasil |
| 201 | Created - Data berhasil dibuat |
| 400 | Bad Request - Parameter tidak valid atau tidak lengkap |
| 401 | Unauthorized - Autentikasi diperlukan |
| 403 | Forbidden - Tidak memiliki izin untuk mengakses resource |
| 404 | Not Found - Resource tidak ditemukan |
| 500 | Internal Server Error - Kesalahan pada server |

## Metode Pembayaran yang Didukung

- `transfer_bank` - Transfer Bank
- `e-wallet` - E-Wallet (OVO, GoPay, DANA, dll)
- `qris` - QRIS
- `virtual_account` - Virtual Account

## Status Donasi

- `pending` - Menunggu pembayaran
- `success` - Donasi berhasil
- `failed` - Donasi gagal

## Status Validasi

- `pending` - Menunggu validasi
- `valid` - Bukti pembayaran valid
- `invalid` - Bukti pembayaran tidak valid

## Struktur Database

### Tabel tb_donasi

| Field | Tipe | Deskripsi |
|-------|------|-----------|
| id | INT | Primary Key, Auto Increment |
| nama_donatur | VARCHAR(100) | Nama pemberi donasi |
| email | VARCHAR(100) | Email pemberi donasi |
| nominal | DECIMAL(15,2) | Jumlah nominal donasi |
| metode_pembayaran | VARCHAR(50) | Metode pembayaran yang digunakan |
| komentar | TEXT | Komentar atau pesan dari donatur |
| status | VARCHAR(20) | Status donasi (pending, success, failed) |
| created_at | TIMESTAMP | Waktu pembuatan data donasi |
| updated_at | TIMESTAMP | Waktu terakhir pembaruan data donasi |

### Tabel tb_validasi_donasi

| Field | Tipe | Deskripsi |
|-------|------|-----------|
| id | INT | Primary Key, Auto Increment |
| id_donasi | INT | Foreign Key ke tabel tb_donasi |
| bukti_pembayaran | VARCHAR(255) | URL bukti pembayaran |
| catatan_validasi | TEXT | Catatan dari validator |
| status_validasi | VARCHAR(20) | Status validasi (pending, valid, invalid) |
| validator | VARCHAR(100) | Nama validator |
| created_at | TIMESTAMP | Waktu pembuatan data validasi |
| updated_at | TIMESTAMP | Waktu terakhir pembaruan data validasi |

### Tabel tb_riwayat_donasi

| Field | Tipe | Deskripsi |
|-------|------|-----------|
| id | INT | Primary Key, Auto Increment |
| id_donasi | INT | Foreign Key ke tabel tb_donasi |
| status_sebelumnya | VARCHAR(20) | Status donasi sebelum perubahan |
| status_terbaru | VARCHAR(20) | Status donasi setelah perubahan |
| keterangan | TEXT | Keterangan perubahan status |
| created_at | TIMESTAMP | Waktu pembuatan riwayat |

### Tabel tb_akses_api

| Field | Tipe | Deskripsi |
|-------|------|-----------|
| id | INT | Primary Key, Auto Increment |
| endpoint | VARCHAR(255) | Endpoint API yang diakses |
| method | VARCHAR(10) | Method HTTP yang digunakan |
| ip_address | VARCHAR(50) | Alamat IP pengguna |
| user_agent | VARCHAR(255) | User agent pengguna |
| status_code | INT | Kode status HTTP response |
| response_time | INT | Waktu respons dalam milidetik |
| created_at | TIMESTAMP | Waktu akses |
