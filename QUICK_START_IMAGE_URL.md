# Quick Start: Image URL Resolution

## Problem
Backend mengirim image path dalam berbagai format:
- ❌ `"products/asus.jpg"` (relative path) → tidak tampil di frontend
- ❌ `"/products/asus.jpg"` (path dengan leading slash) → tidak tampil
- ✅ `"http://localhost:8000/products/asus.jpg"` (full URL) → tampil
- ❌ `null` → error atau placeholder buruk

## Solution Implemented

### 1. Helper Function

File: `src/utils/imageUtils.ts`

```typescript
// Resolve single image URL - handle full URL + relative path
export const resolveImageUrl = (imagePath?: string | null): string

// Resolve multiple images dengan fallback
export const resolveImageUrls = (
  images?: string[] | null, 
  fallbackThumbnail?: string | null
): string[]

// Get single primary image
export const getPrimaryImageUrl = (
  images?: string[] | null, 
  thumbnail?: string | null
): string

// Safe src dengan fallback placeholder
export const getSafeSrc = (url: string): string

// SVG placeholder
export const getPlaceholderImage = (): string
```

### 2. Environment Variable

`.env`:
```bash
VITE_API_BASE_URL=http://localhost:8000
```

Untuk production:
```bash
VITE_API_BASE_URL=https://api.yourdomain.com
```

### 3. Usage in Components

#### ProductDetail
```tsx
import { resolveImageUrl, resolveImageUrls, getSafeSrc, getPlaceholderImage } from "@/utils/imageUtils";

// Resolve images dengan fallback
const resolvedImages = resolveImageUrls(product.images, product.thumbnail);
const thumbnails = resolvedImages.length > 0 ? resolvedImages : [getPlaceholderImage()];

// Render dengan safe src
<img 
  src={getSafeSrc(thumbnails[safeIndex])}
  alt={product.name}
  onError={(e) => {
    (e.target as HTMLImageElement).src = getPlaceholderImage();
  }}
/>
```

#### Product Cards
```tsx
<img 
  src={getSafeSrc(resolveImageUrl(product.thumbnail) || resolveImageUrl(product.images?.[0]))} 
  alt={product.name}
  onError={(e) => {
    (e.target as HTMLImageElement).src = getPlaceholderImage();
  }}
/>
```

## How It Works

```
Input: "products/asus.jpg"
  ↓
Check if full URL? NO
  ↓
Check if leading slash? YES → remove
  ↓
Prepend VITE_API_BASE_URL
  ↓
Output: "http://localhost:8000/products/asus.jpg"
  ↓
✅ Image loads in browser!
```

## Step-by-Step: Integrate in New Component

### 1. Import
```typescript
import { 
  resolveImageUrl, 
  getSafeSrc, 
  getPlaceholderImage 
} from "@/utils/imageUtils";
```

### 2. Resolve URLs
```typescript
const imageUrl = resolveImageUrl(product.thumbnail);
// or
const imageUrl = getSafeSrc(resolveImageUrl(product.images?.[0]));
```

### 3. Render
```tsx
<img 
  src={imageUrl}
  alt="description"
  onError={(e) => {
    (e.target as HTMLImageElement).src = getPlaceholderImage();
  }}
/>
```

## Common Patterns

### Pattern 1: Main Product Image
```tsx
const imageUrl = resolveImageUrl(product.thumbnail) || 
                 resolveImageUrl(product.images?.[0]) || 
                 getPlaceholderImage();

<img src={getSafeSrc(imageUrl)} alt={product.name} />
```

### Pattern 2: Product Card List
```tsx
<img 
  src={getSafeSrc(resolveImageUrl(product.thumbnail) || resolveImageUrl(product.images?.[0]))}
  alt={product.name}
/>
```

### Pattern 3: Multiple Images Gallery
```typescript
const resolved = resolveImageUrls(product.images, product.thumbnail);
const thumbnails = resolved.length > 0 ? resolved : [getPlaceholderImage()];

<img src={getSafeSrc(thumbnails[index])} alt="product" />
```

## Test It

### Backend returns relative path
```bash
# API response
{
  "thumbnail": "products/asus.jpg",
  "images": ["products/asus-1.jpg", "products/asus-2.jpg"]
}

# Expected
✅ All images display with prepended base URL
```

### Backend returns full URL
```bash
# API response
{
  "thumbnail": "http://localhost:8000/products/asus.jpg"
}

# Expected
✅ Image displays as-is (no double prepend)
```

### No images
```bash
# API response
{
  "thumbnail": null,
  "images": null
}

# Expected
✅ Placeholder SVG displays
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Images tidak tampil | 1. Check `.env` VITE_API_BASE_URL<br>2. Verify image path dari backend<br>3. Test URL di browser |
| CORS error | Update backend CORS configuration |
| Placeholder tampil | Check image path, verify file exists di backend |
| Wrong URL formed | Check for leading slashes, verify base URL |

## Files Changed

```
✅ Created: src/utils/imageUtils.ts
✅ Updated: .env (added VITE_API_BASE_URL)
✅ Updated: .env.example (added VITE_API_BASE_URL)
✅ Updated: src/pages/ProductDetail.tsx
✅ Updated: src/pages/Products.tsx
✅ Updated: src/components/FeaturedProducts.tsx
✅ Created: IMAGE_URL_RESOLUTION.md (detailed docs)
✅ Created: IMPLEMENTATION_SUMMARY.md (implementation guide)
```

## Production Deploy

1. Update `.env`:
   ```bash
   VITE_API_BASE_URL=https://api.yourdomain.com
   ```

2. Build:
   ```bash
   npm run build
   ```

3. Deploy:
   ```bash
   # Environment variable baked into build
   npm run preview
   ```

## Quick Reference

```typescript
// Single image
resolveImageUrl("products/image.jpg")
// → "http://localhost:8000/products/image.jpg"

// Multiple images
resolveImageUrls(["products/1.jpg"], "products/thumb.jpg")
// → ["http://localhost:8000/products/1.jpg"]

// Safe render
getSafeSrc(resolveImageUrl("products/image.jpg"))
// → URL, atau fallback ke placeholder

// In JSX
<img src={getSafeSrc(resolveImageUrl(imageUrl))} />
```

---

**That's it! 🚀 Images dari backend sekarang siap digunakan di frontend!**
