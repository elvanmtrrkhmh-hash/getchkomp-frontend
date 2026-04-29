# Tech Komputer Hub - Backend API

API untuk sistem autentikasi customer (register, login) dan manajemen profil.

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Konfigurasi Environment

Buat file `.env` dengan isi:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/tech-komputer-hub
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

### 3. Pastikan MongoDB Running

MongoDB harus sudah berjalan pada port 27017, atau sesuaikan `MONGODB_URI` di `.env`.

### 4. Jalankan Server

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

Server akan berjalan di `http://localhost:5000`

## API Endpoints

### 1. Register Customer

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "08123456789"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "customer": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "08123456789"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Email sudah terdaftar",
  "errors": [...]
}
```

### 2. Login Customer

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "customer": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "08123456789"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Email atau password salah"
}
```

### 3. Get Current User Profile (Protected)

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "customer": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "08123456789",
    "address": "Jl. Merdeka No. 123",
    "city": "Jakarta",
    "province": "DKI Jakarta",
    "postalCode": "12345",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### 4. Update Customer Profile (Protected)

**Endpoint:** `PUT /api/auth/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "fullName": "John Doe Updated",
  "phone": "08987654321",
  "address": "Jl. Sudirman No. 456",
  "city": "Jakarta",
  "province": "DKI Jakarta",
  "postalCode": "12346"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profil berhasil diperbarui",
  "customer": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe Updated",
    "email": "john@example.com",
    "phone": "08987654321",
    "address": "Jl. Sudirman No. 456",
    "city": "Jakarta",
    "province": "DKI Jakarta",
    "postalCode": "12346",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:45:00Z"
  }
}
```

## Struktur Project

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database connection
│   ├── controllers/
│   │   └── authController.js    # Auth logic
│   ├── middleware/
│   │   ├── auth.js              # JWT middleware
│   │   └── validation.js        # Input validation
│   ├── models/
│   │   └── Customer.js          # Customer schema
│   ├── routes/
│   │   └── authRoutes.js        # Auth routes
│   └── server.js                # Main server file
├── .env                         # Environment variables
├── package.json
└── README.md
```

## Security Features

- ✅ Password hashing dengan bcryptjs
- ✅ JWT token untuk autentikasi
- ✅ Input validation
- ✅ CORS protection
- ✅ Token expiration
- ✅ Protected routes

## Token Usage

Setiap request ke protected route harus menyertakan token di header:

```
Authorization: Bearer {your_token_here}
```

## Development Notes

- Token akan expired sesuai dengan `JWT_EXPIRE` di .env (default: 7d)
- Password tidak pernah return ke client
- Email unique untuk setiap customer
- Semua error messages dalam bahasa Indonesia
