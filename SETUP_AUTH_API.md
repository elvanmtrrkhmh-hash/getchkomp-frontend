# Setup Guide - API Register & Login

Panduan lengkap untuk setup API Register dan Login customer di Tech Komputer Hub.

## 📁 Struktur Folder

```
tech-komputer-hub/
├── backend/                    # Backend API (BARU)
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   └── authController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── validation.js
│   │   ├── models/
│   │   │   └── Customer.js
│   │   ├── routes/
│   │   │   └── authRoutes.js
│   │   └── server.js
│   ├── .env
│   ├── package.json
│   └── README.md
├── src/
│   ├── services/
│   │   └── authService.ts      # Frontend API service (BARU)
│   ├── hooks/
│   │   └── useAuth.ts          # useAuth hook (BARU)
│   └── ... (existing files)
├── .env.example
└── ... (existing files)
```

## 🚀 Setup Backend

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup MongoDB

Pastikan MongoDB sudah terinstall dan berjalan. Jika belum:

**Windows - MongoDB Community:**
1. Download dari https://www.mongodb.com/try/download/community
2. Install dengan installer
3. MongoDB akan default berjalan di `mongodb://localhost:27017`

**Atau gunakan MongoDB Atlas (Cloud):**
1. Buat akun di https://www.mongodb.com/cloud/atlas
2. Buat cluster gratis
3. Dapatkan connection string
4. Update `MONGODB_URI` di `.env`

### 3. Setup Environment Variables

Edit file `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/tech-komputer-hub
JWT_SECRET=your_super_secret_key_here_change_in_production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

### 4. Jalankan Backend Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000`

Output:
```
MongoDB Connected: localhost
Server running on port 5000
Environment: development
```

## 🎨 Setup Frontend Integration

### 1. Buat .env file di root folder

Buat file `.env` di root (copy dari `.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Gunakan useAuth Hook

Contoh di komponen React:

```tsx
import { useAuth } from '@/hooks/useAuth';

function LoginPage() {
  const { login, isLoading, error } = useAuth();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await login(
        formData.get('email') as string,
        formData.get('password') as string
      );
      // Navigate ke dashboard
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" name="email" required />
      <input type="password" name="password" required />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Login'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
```

### 3. Gunakan authService Secara Langsung

```tsx
import { authService } from '@/services/authService';

// Register
const registerResult = await authService.register({
  fullName: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  phone: '08123456789'
});

// Login
const loginResult = await authService.login('john@example.com', 'password123');

// Get Current User
const userResult = await authService.getCurrentUser();

// Update Profile
const updateResult = await authService.updateProfile({
  fullName: 'John Doe Updated',
  phone: '08987654321'
});

// Logout
authService.logout();

// Check if authenticated
if (authService.isAuthenticated()) {
  // User is logged in
}
```

## 📝 API Endpoints

### Public Endpoints

**POST /api/auth/register**
- Register customer baru
- Body: `{ fullName, email, password, phone? }`

**POST /api/auth/login**
- Login customer
- Body: `{ email, password }`

### Protected Endpoints (Require Token)

**GET /api/auth/me**
- Get profil customer yang sedang login
- Header: `Authorization: Bearer {token}`

**PUT /api/auth/profile**
- Update profil customer
- Header: `Authorization: Bearer {token}`
- Body: `{ fullName?, phone?, address?, city?, province?, postalCode? }`

## 🧪 Testing API

### Menggunakan Postman

1. **POST Register:**
   - URL: `http://localhost:5000/api/auth/register`
   - Method: POST
   - Body (JSON):
   ```json
   {
     "fullName": "Test User",
     "email": "test@example.com",
     "password": "password123",
     "phone": "08123456789"
   }
   ```

2. **POST Login:**
   - URL: `http://localhost:5000/api/auth/login`
   - Method: POST
   - Body (JSON):
   ```json
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```
   - Copy token dari response

3. **GET Profile:**
   - URL: `http://localhost:5000/api/auth/me`
   - Method: GET
   - Headers:
     - Key: `Authorization`
     - Value: `Bearer {token_dari_login}`

### Menggunakan cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "08123456789"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get Profile (ganti TOKEN dengan token dari response login)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

## 🔐 Security Best Practices

✅ **Sudah Implementasi:**
- Password hashing dengan bcryptjs (salting 10 rounds)
- JWT token dengan expiration
- Input validation
- CORS protection
- Protected routes

⚠️ **Untuk Production:**
1. Ganti `JWT_SECRET` dengan kunci yang lebih kuat
2. Setup HTTPS
3. Gunakan environment variables yang aman
4. Implement rate limiting
5. Implement refresh token untuk JWT
6. Implement email verification
7. Implement password reset functionality
8. Setup proper logging & monitoring

## 📚 Struktur Response

### Success Response

```json
{
  "success": true,
  "message": "...",
  "token": "jwt_token_here",
  "customer": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "08123456789"
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

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Pastikan MongoDB sudah berjalan
- Check connection string di `.env`
- Pastikan firewall tidak memblokir port 27017

**CORS Error:**
- Update `CORS_ORIGIN` di `.env` sesuai dengan frontend URL
- Default: `http://localhost:5173`

**Token Invalid/Expired:**
- Check token expiration di `.env` (`JWT_EXPIRE`)
- Clear localStorage dan login ulang
- Ensure JWT_SECRET same di backend

**Port Already in Use:**
```bash
# Windows - Kill process di port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

## 📞 Support

Jika ada error atau pertanyaan, check:
1. Backend console log
2. Browser console (F12 > Console)
3. Network tab untuk request/response
4. API documentation di `backend/README.md`

---

**Happy Coding! 🚀**
