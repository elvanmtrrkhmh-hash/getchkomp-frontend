# Update - Integrasi API Port 8000

Halaman login, register, dan profile telah diupdate untuk menggunakan API yang sudah disediakan di port 8000.

## 📝 Perubahan yang Dilakukan

### 1. Update Base URL API
- **Sebelumnya:** `http://localhost:5000/api`
- **Sekarang:** `http://localhost:8000/api`

**File yang diubah:**
- `src/services/authService.ts` - Base URL updated
- `.env` - Created dengan VITE_API_URL
- `.env.example` - Updated default port

### 2. Update Endpoint Path
- **Sebelumnya:** `/api/auth/*`
- **Sekarang:** `/api/customer/*`

**Endpoint yang digunakan:**
```
POST   /api/customer/register  - Register customer baru
POST   /api/customer/login     - Login customer
GET    /api/customer/me        - Get current user profile (Protected)
PUT    /api/customer/me        - Update user profile (Protected)
```

**File yang diubah:**
- `src/services/authService.ts` - Semua endpoint path updated

### 3. Improve Profile Page
- **Fetch data dari API** saat page load (bukan hanya dari localStorage)
- **Loading indicator** saat fetch data
- **Better error handling** untuk API calls

**File yang diubah:**
- `src/pages/Profile.tsx` - Added getData fetch + loading state

### 4. Update Frontend Configuration
**Updated files:**
- `src/App.tsx` - Routes sudah ada
- `src/components/Navbar.tsx` - User dropdown integration
- `src/pages/Login.tsx` - Improved error handling
- `src/pages/Register.tsx` - Ready untuk API
- `src/components/UserDropdown.tsx` - User menu

## 🚀 Cara Menggunakannya

### 1. Pastikan API Running di Port 8000
```bash
# API harus sudah berjalan
http://localhost:8000
```

### 2. Frontend sudah siap
- Development server ada di `http://localhost:5173`
- Otomatis akan hit API di `http://localhost:8000/api`

### 3. Test Login Flow
1. Go to `http://localhost:5173/register`
2. Daftar dengan email & password baru
3. Redirect ke home
4. Klik User icon di navbar
5. Lihat user dropdown muncul

### 4. Test Login
1. Go to `http://localhost:5173/login`
2. Masuk dengan email & password yang sudah register
3. Berhasil → redirect ke home
4. User dropdown muncul di navbar

### 5. Test Profile
1. Sudah login → Go to `http://localhost:5173/profile`
2. Edit data profil (nama, telepon, alamat)
3. Click "Simpan Perubahan"
4. Data tersimpan di database

## 🔑 Environment Variables

**File: `.env` di root folder**
```env
VITE_API_URL=http://localhost:8000/api
```

Jika API berada di server lain, update variable ini sesuai kebutuhan:
```env
VITE_API_URL=https://api.example.com/api
```

## 📊 API Response Structure

Pastikan API Anda mengembalikan response dengan struktur seperti ini:

### Register Response
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "customer": {
    "id": "customer_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "08123456789"
  }
}
```

### Login Response
```json
{
  "success": true,
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "customer": {
    "id": "customer_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "08123456789"
  }
}
```

### Get User Response
```json
{
  "customer": {
    "id": "customer_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "08123456789",
    "address": "Jl. Merdeka No. 123",
    "city": "Jakarta",
    "province": "DKI Jakarta",
    "postalCode": "12345"
  }
}
```

### Update Profile Response
```json
{
  "customer": {
    "id": "customer_id",
    "fullName": "John Doe Updated",
    "email": "john@example.com",
    "phone": "08987654321",
    "address": "Jl. Sudirman No. 456",
    "city": "Jakarta",
    "province": "DKI Jakarta",
    "postalCode": "12346"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message here",
  "errors": []
}
```

## 🔐 Token Handling

- **Token Storage:** Disimpan di `localStorage` dengan key `token`
- **Token Header:** `Authorization: Bearer {token}`
- **Token Expiry:** Sesuaikan di backend

## 🧪 Testing dengan Postman

### Register
```
POST http://localhost:8000/api/customer/register
Content-Type: application/json

{
  "fullName": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "phone": "08123456789"
}
```

### Login
```
POST http://localhost:8000/api/customer/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

Response berisi `token` yang harus disimpan untuk request berikutnya.

### Get Profile
```
GET http://localhost:8000/api/customer/me
Authorization: Bearer {token_dari_login}
```

### Update Profile
```
PUT http://localhost:8000/api/customer/me
Authorization: Bearer {token_dari_login}
Content-Type: application/json

{
  "fullName": "Updated Name",
  "phone": "08987654321",
  "address": "Jl. Sudirman No. 456",
  "city": "Jakarta",
  "province": "DKI Jakarta",
  "postalCode": "12346"
}
```

## 🐛 Troubleshooting

### CORS Error
- Pastikan API sudah enable CORS
- Check VITE_API_URL sudah benar
- Restart dev server setelah update .env

### Token Invalid Error
- Clear localStorage: `localStorage.clear()`
- Login ulang
- Check token expiry di backend

### API Not Found
- Pastikan endpoint sesuai dengan route di backend
- URL harus: `http://localhost:8000/api/customer/*`
- Test dengan Postman dulu sebelum test di frontend

### 404 Not Found
- Check API server sudah running di port 8000
- Verify endpoint path: `/api/customer/` bukan `/api/auth/`

## 📚 Component Usage

### useAuth Hook
```tsx
import { useAuth } from "@/hooks/useAuth";

const MyComponent = () => {
  const { 
    customer,           // Current user
    isLoading,         // Loading state
    error,             // Error message
    login,             // Login function
    register,          // Register function
    logout,            // Logout function
    updateProfile,     // Update profile function
  } = useAuth();

  // Usage
  if (customer) {
    // User is logged in
  }
};
```

### authService
```tsx
import { authService } from "@/services/authService";

// Register
await authService.register({
  fullName: "John",
  email: "john@example.com",
  password: "pass123"
});

// Login
await authService.login("john@example.com", "pass123");

// Get current user
await authService.getCurrentUser();

// Update profile
await authService.updateProfile({
  phone: "08123456789"
});

// Logout
authService.logout();

// Check if authenticated
if (authService.isAuthenticated()) {
  // ...
}
```

## ✅ Checklist

- [x] API base URL updated ke port 8000
- [x] Endpoint path updated ke `/api/customer/`
- [x] Environment variable configured
- [x] Login page siap
- [x] Register page siap  
- [x] Profile page siap
- [x] Navbar dengan user dropdown
- [x] Error handling improved
- [x] Loading state added
- [x] Token management working
- [x] Protected routes implemented

## 📞 Support

Jika ada masalah atau error:
1. Check console browser (F12 > Console)
2. Check Network tab untuk melihat request/response
3. Lihat error message dari API response
4. Pastikan API server running
5. Clear cache & restart dev server

---

**Happy Coding! 🚀**
