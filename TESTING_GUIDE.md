# Quick Start - Login, Register, Profile dengan API Port 8000

Panduan cepat untuk test halaman login, register, dan profile dengan API yang ada di port 8000.

## ⚡ Setup Cepat

### 1. Update Environment Variable
File `.env` sudah dibuat di root folder dengan:
```env
VITE_API_URL=http://localhost:8000/api
```

Jika perlu mengubah, edit file `.env` ini sesuai lokasi API Anda.

### 2. Pastikan API Running
API harus sudah berjalan di:
```
http://localhost:8000
```

Endpoint yang digunakan:
- `POST /api/customer/register` - Register customer baru
- `POST /api/customer/login` - Login customer
- `GET /api/customer/me` - Get current user (Protected)
- `PUT /api/customer/me` - Update user (Protected)

### 3. Jalankan Frontend
```bash
npm run dev
```
Frontend akan berjalan di `http://localhost:5173`

## 📋 Test Cases

### Test 1: Register Customer Baru

**Steps:**
1. Go to `http://localhost:5173/register`
2. Isi form:
   - Nama Lengkap: `John Doe`
   - Email: `john@example.com`
   - No. Telepon: `08123456789` (opsional)
   - Password: `password123`
   - Konfirmasi Password: `password123`
3. Click tombol "Daftar"

**Expected Results:**
- ✅ Toast success muncul: "Registrasi berhasil"
- ✅ Auto redirect ke home page
- ✅ User dropdown muncul di navbar
- ✅ Token disimpan di localStorage

**Debug jika error:**
- Check console (F12 > Console)
- Network tab lihat response dari API
- Pastikan email belum terdaftar
- Pastikan data valid

---

### Test 2: Login dengan Email yang Sudah Register

**Steps:**
1. Go to `http://localhost:5173/login`
2. Isi form:
   - Email: `john@example.com`
   - Password: `password123`
3. Click tombol "Masuk"

**Expected Results:**
- ✅ Toast success muncul: "Login berhasil"
- ✅ Auto redirect ke home page
- ✅ User dropdown muncul di navbar dengan:
  - Nama: John Doe
  - Email: john@example.com
- ✅ Token disimpan di localStorage
- ✅ Browser console show token

**Debug jika error:**
- Check email & password benar
- Pastikan customer sudah register
- Check API response di Network tab
- Lihat error message dari API

---

### Test 3: Lihat User Dropdown

**Steps:**
1. Login terlebih dahulu (ikuti Test 2)
2. Klik User icon (👤) di navbar bagian kanan
3. Lihat dropdown menu

**Expected Results:**
- ✅ Dropdown muncul dengan:
  - Nama customer
  - Email customer
  - Button "Profil & Pengaturan"
  - Button "Logout"

---

### Test 4: Akses Profile Page

**Steps:**
1. Login terlebih dahulu (ikuti Test 2)
2. Go to `http://localhost:5173/profile`
   - OR klik "Profil & Pengaturan" di user dropdown

**Expected Results:**
- ✅ Halaman profile terbuka
- ✅ Avatar dengan inisial nama (J untuk John)
- ✅ Form fields sudah terisi dengan data dari API:
  - Nama Lengkap
  - Email (read-only)
  - No. Telepon
  - Alamat
  - Kota
  - Provinsi
  - Kode Pos
- ✅ Loading indicator hilang setelah data terload

---

### Test 5: Edit Profile dan Save

**Steps:**
1. Buka profile page (ikuti Test 4)
2. Edit fields:
   - Nama Lengkap: Ubah ke `John Doe Updated`
   - No. Telepon: `08987654321`
   - Alamat: `Jl. Sudirman No. 456`
   - Kota: `Jakarta`
   - Provinsi: `DKI Jakarta`
   - Kode Pos: `12346`
3. Click tombol "Simpan Perubahan"

**Expected Results:**
- ✅ Toast success: "Profil berhasil diperbarui"
- ✅ Data tersimpan di database
- ✅ Navbar profile info update (jika di-refresh)

**Debug jika error:**
- Check Network tab untuk response
- Lihat error message di toast
- Verify API endpoint `/api/customer/me` PUT method

---

### Test 6: Logout

**Steps:**
1. Sudah login
2. Klik User dropdown
3. Click button "Logout"

**Expected Results:**
- ✅ Toast: "Logout Berhasil"
- ✅ Redirect ke home page
- ✅ User icon di navbar kembali ke button login
- ✅ Token dihapus dari localStorage
- ✅ Can't access profile page (redirect ke login)

**Debug:**
- Check localStorage cleared: `localStorage.clear()` di console

---

### Test 7: Redirect ke Login jika Belum Login

**Steps:**
1. Pastikan belum login (logout dulu jika sudah)
2. Go to `http://localhost:5173/profile`

**Expected Results:**
- ✅ Auto redirect ke login page
- ⚠️ User tidak bisa akses profile tanpa login

---

### Test 8: Link Register & Login

**Steps 1: Di halaman Login**
1. Go to `http://localhost:5173/login`
2. Klik link "Daftar di sini" di bawah form

**Expected:**
- ✅ Redirect ke halaman register

**Steps 2: Di halaman Register**
1. Go to `http://localhost:5173/register`
2. Klik link "Masuk di sini" di bawah form

**Expected:**
- ✅ Redirect ke halaman login

---

## 🔍 Validasi Frontend

### Register Page
- ✅ Nama minimal 3 karakter
- ✅ Email valid format
- ✅ Password minimal 6 karakter
- ✅ Konfirmasi password harus sama
- ✅ All required fields validation

### Login Page
- ✅ Email & password required
- ✅ Email format validation

### Profile Page
- ✅ Email read-only (tidak bisa edit)
- ✅ Semua field optional (kecuali nama)
- ✅ Protected route - auto redirect login

---

## 📊 API Response Format Check

### Pastikan API mengembalikan format yang benar:

**Register & Login Response:**
```json
{
  "success": true,
  "message": "Success message",
  "token": "jwt_token_here",
  "customer": {
    "id": "customer_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "08123456789"
  }
}
```

**Get/Update Profile Response:**
```json
{
  "customer": {
    "id": "customer_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "08123456789",
    "address": "Jl. Sudirman No. 456",
    "city": "Jakarta",
    "province": "DKI Jakarta",
    "postalCode": "12346"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message here",
  "errors": []
}
```

---

## 🛠️ Developer Tools

### Check localStorage
Di browser console (F12 > Console):
```javascript
// Lihat token
localStorage.getItem('token')

// Lihat customer data
JSON.parse(localStorage.getItem('customer'))

// Clear all
localStorage.clear()
```

### Check Network Requests
Di browser (F12 > Network tab):
1. Refresh halaman
2. Lihat requests ke `http://localhost:8000/api/customer/`
3. Check request headers (Authorization, Content-Type)
4. Check response body dan status code

### Debug API Calls
Di browser console:
```javascript
// Test API directly
const token = localStorage.getItem('token');

fetch('http://localhost:8000/api/customer/me', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data))
```

---

## ⚠️ Common Issues

### Issue: CORS Error
**Solution:**
- Pastikan API enable CORS
- Check VITE_API_URL di .env
- Restart dev server

### Issue: Token Invalid
**Solution:**
- Clear localStorage: `localStorage.clear()`
- Login ulang
- Check token expiry di backend

### Issue: Email Already Exists
**Solution:**
- Register dengan email baru
- Atau gunakan email yang belum pernah register

### Issue: API Not Found (404)
**Solution:**
- Pastikan endpoint path benar: `/api/customer/`
- Check API server running di port 8000
- Verify base URL di .env: `VITE_API_URL=http://localhost:8000/api`

### Issue: Can't Access Profile after Login
**Solution:**
- Refresh halaman
- Check token di localStorage
- Logout & login ulang

---

## 📞 Quick Reference

| Action | URL | Status |
|--------|-----|--------|
| Register | `/register` | ✅ Public |
| Login | `/login` | ✅ Public |
| Profile | `/profile` | 🔒 Protected |
| Home | `/` | ✅ Public |

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/api/customer/register` | POST | ❌ | ✅ |
| `/api/customer/login` | POST | ❌ | ✅ |
| `/api/customer/me` | GET | ✅ | ✅ |
| `/api/customer/me` | PUT | ✅ | ✅ |

---

**Semua siap! Mulai testing sekarang! 🚀**

Kalau ada pertanyaan atau error, check console browser dan Network tab untuk detail error dari API.
