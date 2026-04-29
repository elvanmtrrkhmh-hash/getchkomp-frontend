# Halaman Login, Register & Profile - Frontend

Dokumentasi untuk halaman user authentication di frontend.

## 📁 File yang Dibuat

```
src/
├── pages/
│   ├── Login.tsx         # Halaman Login
│   ├── Register.tsx      # Halaman Registrasi
│   └── Profile.tsx       # Halaman Profil User
├── components/
│   └── UserDropdown.tsx  # Dropdown User di Navbar
└── App.tsx               # Updated dengan routes baru
```

## 🔐 Halaman Login

**Path:** `/login`

### Fitur
- ✅ Form login dengan email & password
- ✅ Validasi input basic
- ✅ Error handling dengan toast notification
- ✅ Redirect ke dashboard jika sudah login
- ✅ Link ke halaman register untuk user baru
- ✅ Loading state saat proses login

### Penggunaan
```tsx
import Login from "@/pages/Login";
// Route sudah tersedia di App.tsx
```

### Flow
1. User masuk email & password
2. Click tombol "Masuk"
3. Hit API `/api/auth/login`
4. Token & customer data disimpan di localStorage
5. Redirect ke halaman utama

## 📝 Halaman Register

**Path:** `/register`

### Fitur
- ✅ Form registrasi lengkap (nama, email, password, no telepon)
- ✅ Validasi password (minimal 6 karakter)
- ✅ Validasi konfirmasi password
- ✅ Phone number optional
- ✅ Error messages yang jelas
- ✅ Link ke halaman login untuk existing users
- ✅ Loading state saat proses registrasi

### Penggunaan
```tsx
import Register from "@/pages/Register";
// Route sudah tersedia di App.tsx
```

### Validasi
- **Nama Lengkap:** Required, minimal 3 karakter
- **Email:** Required, format email valid
- **Password:** Required, minimal 6 karakter
- **Confirm Password:** Harus sama dengan password
- **No Telepon:** Optional

### Flow
1. User mengisi form registrasi
2. Validasi data di frontend
3. Click tombol "Daftar"
4. Hit API `/api/auth/register`
5. Token & customer data disimpan
6. Redirect ke halaman utama

## 👤 Halaman Profile

**Path:** `/profile`

### Fitur
- ✅ Edit profil user (nama, no telepon, alamat)
- ✅ Tampilkan email (read-only)
- ✅ Support alamat lengkap (alamat, kota, provinsi, kode pos)
- ✅ Avatar dengan inisial nama
- ✅ Button logout
- ✅ Loading state saat update
- ✅ Success/error notification
- ✅ Protected route - redirect ke login jika belum login

### Penggunaan
```tsx
import Profile from "@/pages/Profile";
// Route sudah tersedia di App.tsx
```

### Proteksi
```tsx
// Halaman akan redirect ke login jika customer belum login
if (!customer) {
  navigate("/login");
}
```

### Form Fields
- Nama Lengkap (editable)
- Email (read-only)
- No Telepon (editable)
- Alamat (editable)
- Kota (editable)
- Provinsi (editable)
- Kode Pos (editable)

### Flow
1. User masuk halaman profile
2. Check apakah sudah login
3. Load data customer dari state
4. Fill form dengan current data
5. Edit field yang diinginkan
6. Click "Simpan Perubahan"
7. Hit API `/api/auth/profile`
8. Update state & show success message

## 🎯 Navbar Integration

### User Dropdown (Logged In)
Saat user sudah login, User icon di navbar menampilkan dropdown dengan:
- Nama user
- Email user
- Link ke halaman profile
- Button logout

```tsx
// src/components/UserDropdown.tsx
<UserDropdown />
```

### Login Button (Not Logged In)
Saat user belum login, User icon adalah link ke halaman login.

### Auto Update
Navbar otomatis update saat user login/logout berkat `useAuth` hook.

## 🎨 UI Components

### Digunakan
- `Button` - Dari shadcn/ui
- `Input` - Dari shadcn/ui
- `DropdownMenu` - Dari shadcn/ui
- `useToast` - For notifications

### Styling
- Responsive design (mobile-friendly)
- Consistent dengan design system
- Dark/light mode support via tailwind

## 🔗 Routes

```
/login          → Login page
/register       → Register page
/profile        → Profile page (protected)
```

## 🧪 Testing

### Test Login
1. Go to `/login`
2. Enter valid credentials
3. Click Masuk
4. Should redirect to home
5. User dropdown should appear di navbar

### Test Register
1. Go to `/register`
2. Fill semua field
3. Click Daftar
4. Should show success toast
5. Auto redirect ke home

### Test Profile
1. Go to `/profile` (must be logged in)
2. If not logged in → redirect ke `/login`
3. Edit beberapa field
4. Click "Simpan Perubahan"
5. Should show success message

### Test Logout
1. Di navbar, klik User dropdown
2. Click "Logout"
3. Should redirect ke home
4. User dropdown disappear, Login button muncul

## 📚 Hook Usage

### useAuth Hook

```tsx
import { useAuth } from "@/hooks/useAuth";

const { 
  customer,      // User data saat ini
  token,         // JWT token
  isLoading,     // Loading state
  error,         // Error message
  register,      // Function untuk register
  login,         // Function untuk login
  logout,        // Function untuk logout
  updateProfile, // Function untuk update profile
  isAuthenticated // Check apakah user sudah login
} = useAuth();
```

### Contoh Penggunaan

```tsx
// Login
const handleLogin = async () => {
  try {
    await login(email, password);
    // User sudah login
  } catch (error) {
    console.error(error);
  }
};

// Register
const handleRegister = async () => {
  try {
    await register({ fullName, email, password });
    // Account created
  } catch (error) {
    console.error(error);
  }
};

// Update Profile
const handleUpdateProfile = async () => {
  try {
    await updateProfile({ 
      fullName, 
      phone, 
      address 
    });
    // Profile updated
  } catch (error) {
    console.error(error);
  }
};

// Logout
const handleLogout = () => {
  logout();
  // User logged out
};

// Check auth status
if (customer) {
  // User is logged in
}
```

## ⚠️ Important Notes

1. **Token Storage:** Token disimpan di `localStorage` dengan key `token`
2. **Protected Routes:** Tambahkan `ProtectedRoute` component jika ingin strict protection
3. **Token Expiry:** Check token expiry di `JWT_EXPIRE` di backend (default 7d)
4. **CORS:** Pastikan `VITE_API_URL` di `.env` sesuai dengan backend URL
5. **Email Verification:** Belum ada email verification, bisa di-add di masa depan

## 🔐 Security

✅ Password hashed di backend
✅ JWT token untuk autentikasi
✅ Token disimpan di localStorage
✅ CORS protection
✅ Input validation frontend & backend
✅ Protected routes di frontend

⚠️ Production Considerations:
- Gunakan secure cookies untuk token (bukan localStorage)
- Implement token refresh mechanism
- Add email verification
- Add password reset functionality
- Implement rate limiting
- Add CAPTCHA untuk register/login

## 📞 Troubleshooting

**Login gagal - Email atau password salah**
- Check email & password sudah benar
- Pastikan sudah register dan email confirm
- Backend harus running

**Token not found error**
- Clear localStorage
- Login ulang
- Check backend CORS setting

**Redirect loop**
- Clear browser cache
- Logout dan login lagi
- Check token validity

**Form validation error**
- Check input format (email, min length)
- Check all required fields filled
- Check error message untuk detail

---

Happy Building! 🚀
