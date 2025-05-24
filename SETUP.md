# Panduan Setup dan Penggunaan API MDonasi

## Setup Database

1. Jalankan script SQL yang ada di file `database.sql` untuk membuat tabel-tabel yang diperlukan:
   ```sql
   mysql -u username -p database_name < database.sql
   ```

2. Atau copy-paste isi file `database.sql` ke phpMyAdmin atau MySQL client lainnya.

## Setup Environment Variables

1. Copy file `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit file `.env` dan isi dengan konfigurasi database Anda:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=mdonasi_db
   JWT_SECRET=your_secret_key_here
   PORT=3000
   ```

## Instalasi Dependencies

```bash
npm install
```

## Menjalankan Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

## Validasi JWT Token

Semua endpoint memerlukan JWT token kecuali endpoint root `/api`. 

### Format Header Authorization
```
Authorization: Bearer your_jwt_token_here
```

### Contoh JWT Token untuk Testing
Anda perlu mendapatkan JWT token dari sistem authentication yang terpisah. Token harus mengandung payload seperti:

```json
{
  "id": "user001",
  "role": "user", // atau "admin" untuk akses admin
  "iat": 1234567890,
  "exp": 1234567890
}
```

## Endpoint Utama

### 1. Status API
- **GET** `/api`
- **Auth**: Tidak diperlukan
- **Response**: Status API dan daftar endpoint

### 2. Manajemen Donasi
- **GET** `/api/donasi` - Daftar donasi (dengan pagination)
- **POST** `/api/donasi` - Buat donasi baru
- **GET** `/api/donasi/:id` - Detail donasi
- **GET** `/api/donasi/user/:userId` - Donasi berdasarkan user
- **PUT** `/api/donasi/:id` - Update donasi
- **DELETE** `/api/donasi/:id` - Hapus donasi

### 3. Validasi Donasi
- **POST** `/api/validasi-donasi/:idDonasi` - Buat validasi (user)
- **PUT** `/api/validasi-donasi/admin/:idDonasi` - Validasi admin (admin only)
- **GET** `/api/validasi-donasi/:idDonasi` - Detail validasi

### 4. Riwayat
- **GET** `/api/donasi/riwayat-donasi/admin` - Riwayat semua donasi (admin only)
- **GET** `/api/riwayat-donasi/:userId` - Riwayat donasi per user

### 5. Akses API
- **GET** `/api/akses-api` - Log akses API (admin only)

## Contoh Penggunaan

### 1. Membuat Donasi Baru
```bash
curl -X POST http://localhost:3000/api/donasi \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{
    "userid": "user001",
    "type": "money",
    "qty": 100000,
    "unit": "rupiah",
    "keterangan": "Semoga bermanfaat"
  }'
```

### 2. Membuat Validasi Donasi
```bash
curl -X POST http://localhost:3000/api/validasi-donasi/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{
    "bukti_pembayaran": "https://example.com/bukti.jpg",
    "catatan_validasi": "Pembayaran sudah masuk"
  }'
```

### 3. Admin Validasi Donasi
```bash
curl -X PUT http://localhost:3000/api/validasi-donasi/admin/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin_jwt_token" \
  -d '{
    "status_validasi": "accepted",
    "catatan_validasi": "Pembayaran sudah dikonfirmasi",
    "validator": "Admin"
  }'
```

## Status Donasi

- `need_validation` - Menunggu user mengirimkan validasi
- `pending` - Menunggu validasi dari admin
- `accepted` - Donasi berhasil divalidasi admin
- `rejected` - Donasi ditolak
- `taken` - Donasi telah diambil penerima

## Error Handling

API mengembalikan response dalam format JSON yang konsisten:

### Success Response
```json
{
  "success": true,
  "message": "Pesan sukses",
  "data": {...},
  "pagination": {...} // jika ada
}
```

### Error Response
```json
{
  "success": false,
  "message": "Pesan error",
  "errors": [...] // jika ada detail error
}
```

## Features

✅ **JWT Token Validation** - Sistem validasi token untuk autentikasi
✅ **Role-based Access** - Kontrol akses berdasarkan role (user/admin)
✅ **API Logging** - Otomatis log semua akses API ke database
✅ **Input Validation** - Validasi input data yang komprehensif
✅ **Pagination** - Support pagination untuk list data
✅ **Error Handling** - Error handling yang konsisten
✅ **Database Connection Pooling** - Koneksi database yang optimal
✅ **No ORM** - Pure SQL queries sesuai permintaan
