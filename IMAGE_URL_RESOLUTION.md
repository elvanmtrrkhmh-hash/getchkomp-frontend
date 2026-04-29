# Image URL Resolution Guide

Sistem untuk menangani image URLs yang mungkin berupa full URL atau relative path dari backend.

## Masalah yang Diselesaikan

- Backend mengirim image path dalam berbagai format:
  - Full URL: `http://localhost:8000/products/image.jpg`
  - Relative path: `products/image.jpg`
  - Path dengan leading slash: `/products/image.jpg`
- Image tidak tampil karena path relatif tidak valid di frontend
- Hardcode base URL di banyak tempat

## Solusi

### 1. Helper Function di `src/utils/imageUtils.ts`

File ini berisi 4 fungsi utama:

#### `resolveImageUrl(imagePath?: string | null): string`
Resolve single image URL, handle full URL maupun relative path

```typescript
// Full URL - return as is
resolveImageUrl("http://localhost:8000/products/image.jpg")
// Output: "http://localhost:8000/products/image.jpg"

// Relative path - prepend base URL
resolveImageUrl("products/image.jpg")
// Output: "http://localhost:8000/products/image.jpg"

// Relative path with leading slash
resolveImageUrl("/products/image.jpg")
// Output: "http://localhost:8000/products/image.jpg"

// Empty/null - return empty string
resolveImageUrl(null)
// Output: ""
```

#### `resolveImageUrls(images?: string[] | null, fallbackThumbnail?: string | null): string[]`
Resolve multiple images dengan fallback ke thumbnail

```typescript
// Use case di ProductDetail untuk gallery
const thumbnails = resolveImageUrls(product.images, product.thumbnail);

// Jika images kosong, akan fallback ke thumbnail
// Semua path akan di-resolve dengan proper base URL
```

#### `getPrimaryImageUrl(images?: string[] | null, thumbnail?: string | null): string`
Get single primary image untuk thumbnail/featured sections

```typescript
// Use case di product cards untuk main image
const primaryImage = getPrimaryImageUrl(product.images, product.thumbnail);
```

#### `getSafeSrc(url: string): string`
Wrapper untuk menjamin src tidak pernah undefined

```typescript
<img src={getSafeSrc(resolveImageUrl(product.thumbnail))} />
```

#### `getPlaceholderImage(): string`
Return SVG placeholder untuk missing images

### 2. Environment Variables

Set di `.env` file:

```bash
# Base URL backend (untuk resolve relative image paths)
VITE_API_BASE_URL=http://localhost:8000
```

Untuk production:
```bash
VITE_API_BASE_URL=https://api.yourdomain.com
```

Sistem akan otomatis menggunakan environment variable ini.

## Implementasi di Components

### ProductDetail.tsx

**Sebelum (tidak handle relative paths):**
```tsx
const thumbnails = product.images || [product.thumbnail];

<img src={thumbnails[safeIndex]} alt="product" />
```

**Sesudah (handle semua format):**
```tsx
import { resolveImageUrl, resolveImageUrls, getSafeSrc, getPlaceholderImage } from "@/utils/imageUtils";

// Resolve semua images + fallback ke thumbnail
const resolvedImages = resolveImageUrls(product.images, product.thumbnail);
const thumbnails = resolvedImages.length > 0 ? resolvedImages : [getPlaceholderImage()];
const safeIndex = Math.max(0, Math.min(selectedThumb, thumbnails.length - 1));

// Gunakan di JSX
<img 
  src={getSafeSrc(thumbnails[safeIndex])}
  alt={product.name}
  onError={(e) => {
    (e.target as HTMLImageElement).src = getPlaceholderImage();
  }}
/>
```

### Products.tsx (Product Cards)

```tsx
import { resolveImageUrl, getSafeSrc, getPlaceholderImage } from "@/utils/imageUtils";

<img 
  src={getSafeSrc(resolveImageUrl(product.thumbnail) || resolveImageUrl(product.images?.[0]))} 
  alt={product.name}
  onError={(e) => {
    (e.target as HTMLImageElement).src = getPlaceholderImage();
  }}
/>
```

### FeaturedProducts.tsx

```tsx
import { resolveImageUrl, getSafeSrc, getPlaceholderImage } from "@/utils/imageUtils";

<img 
  src={getSafeSrc(resolveImageUrl(p.thumbnail) || resolveImageUrl(p.images?.[0]))} 
  alt={p.name}
  onError={(e) => {
    (e.target as HTMLImageElement).src = getPlaceholderImage();
  }}
/>
```

## Fallback Strategy

Sistem menggunakan fallback chain berikut:

```
1. First image dari array: product.images[0]
   ↓ (jika tidak ada)
2. Thumbnail: product.thumbnail
   ↓ (jika tidak ada)
3. Placeholder SVG: getPlaceholderImage()
```

Semua URL di-resolve melalui `resolveImageUrl()` untuk consistency.

## Flow Chart

```
Backend Response
  ├── Full URL: "http://localhost:8000/products/image.jpg"
  │   └─→ resolveImageUrl() → return as-is ✓
  │
  ├── Relative Path: "products/image.jpg"
  │   └─→ resolveImageUrl() → prepend VITE_API_BASE_URL → "http://localhost:8000/products/image.jpg" ✓
  │
  ├── Data URL: "data:image/..."
  │   └─→ resolveImageUrl() → return as-is ✓
  │
  └── Null/Undefined
      └─→ resolveImageUrl() → "" (empty)
          └─→ getSafeSrc() + onError → Placeholder SVG ✓
```

## Keuntungan

✅ **Centralized**: Satu tempat untuk logic image URL resolution  
✅ **Reusable**: Bisa digunakan di semua component yang butuh image  
✅ **Flexible**: Handle berbagai format dari backend  
✅ **Type-safe**: Full TypeScript support  
✅ **Environment-based**: Mudah switch antara dev/prod URL  
✅ **Graceful fallback**: Selalu ada placeholder jika image gagal  
✅ **Performance**: Lazy loading, proper error handling  

## Testing

Untuk test dengan berbagai format dari backend:

### Test 1: Full URL
```bash
# Backend return
{
  thumbnail: "http://localhost:8000/products/asus.jpg",
  images: ["http://localhost:8000/products/asus-1.jpg", ...]
}
# Expected: Image tampil dengan URL as-is
```

### Test 2: Relative Path
```bash
# Backend return
{
  thumbnail: "products/asus.jpg",
  images: ["products/asus-1.jpg", ...]
}
# Expected: Image tampil dengan base URL prepended
# Result: "http://localhost:8000/products/asus.jpg"
```

### Test 3: Leading Slash
```bash
# Backend return
{
  thumbnail: "/products/asus.jpg",
  images: ["/products/asus-1.jpg", ...]
}
# Expected: Double slash removed, correct URL formed
# Result: "http://localhost:8000/products/asus.jpg"
```

### Test 4: Missing Images
```bash
# Backend return
{
  thumbnail: null,
  images: null
}
# Expected: Placeholder SVG tampil
```

## Troubleshooting

### Images tidak tampil?

1. **Check Environment Variable**
   ```bash
   # Di browser console
   console.log(import.meta.env.VITE_API_BASE_URL)
   # Harus print URL backend
   ```

2. **Check Resolved URL**
   ```tsx
   const url = resolveImageUrl(imagePath);
   console.log('Resolved URL:', url);
   // Copy ke browser, pastikan image bisa diakses
   ```

3. **Check CORS**
   - Backend harus allow CORS dari frontend URL
   - Check backend CORS configuration

4. **Check File Path**
   - Pastikan file exist di backend
   - Verify path format (case-sensitive di Linux/Mac)

### CORS Error?

Backend perlu configure CORS:

```javascript
// backend/src/server.js
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:8080', // Frontend URL
  credentials: true
}));
```

## Production Deployment

1. **Update .env untuk production:**
   ```bash
   VITE_API_BASE_URL=https://api.yourdomain.com
   ```

2. **Build:**
   ```bash
   npm run build
   ```

3. **Environment variables di-inline saat build**
   - Frontend akan menggunakan production URL
   - Tidak perlu hardcode

## Kesimpulan

Dengan solusi ini:
- ✅ Images dari backend (relative atau full URL) akan tampil dengan benar
- ✅ Tidak ada hardcode base URL di components
- ✅ Mudah di-maintain dan di-scale
- ✅ Type-safe dengan TypeScript
- ✅ Graceful fallback untuk missing images
