# API Product Integration Guide

## Overview
Your project menggunakan **API untuk mengambil data produk** dari backend MongoDB. Data ditampilkan di frontend dengan pagination, filtering, dan searching.

## 📍 API Endpoints

### 1. **GET /api/catalog** - Fetch All Products
Mengambil semua produk dari database dengan support pagination, filtering, dan search.

**Base URL:** `http://localhost:8000/api`

**Endpoint:** `GET /api/catalog`

**Query Parameters:**
```
page       (number) - Halaman (default: 1)
limit      (number) - Jumlah produk per halaman (default: 12, max: 100)
category   (string) - Filter by kategori (e.g., "Monitor", "Keyboard", "Mouse")
search     (string) - Pencarian di name, description, atau brand
sort       (string) - Sorting field (default: "-createdAt" untuk newest first)
featured   (string) - Filter featured products ("true"/"false")
bestseller (string) - Filter bestseller products ("true"/"false")
```

**Example Request:**
```javascript
// Ambil produk halaman 1 dengan 12 items
GET http://localhost:8000/api/catalog?page=1&limit=12

// Ambil produk di kategori "Monitor"
GET http://localhost:8000/api/catalog?category=Monitor

// Cari produk dengan keyword "ASUS"
GET http://localhost:8000/api/catalog?search=ASUS

// Ambil featured products
GET http://localhost:8000/api/catalog?featured=true

// Kombinasi: Monitor featured, halaman 2, 20 items per page
GET http://localhost:8000/api/catalog?category=Monitor&featured=true&page=2&limit=20
```

**Response Success (200):**
```json
{
  "status": "success",
  "message": "Products fetched successfully",
  "products": {
    "data": [
      {
        "id": "product_id",
        "name": "ASUS ROG Swift OLED PG27UCDM",
        "description": "Monitor gaming 4K...",
        "brand": "ASUS",
        "category": "Monitor",
        "price": 15990000,
        "rating": 4.9,
        "thumbnail": "/products/asus-rog-1.jpg",
        "images": ["url1", "url2", "url3"],
        "features": ["4K UHD", "240Hz", "0.03ms"],
        "overview": ["Panel QD-OLED...", "Refresh rate 240Hz..."],
        "colors": ["Black", "Silver", "Gray"],
        "isFeatured": true,
        "isBestseller": false,
        "specs": {...},
        "availability": {
          "status": "in_stock",
          "label": "Tersedia",
          "color": "green"
        }
      }
    ],
    "meta": {
      "total": 120,
      "current_page": 1,
      "per_page": 12,
      "last_page": 10
    }
  }
}
```

---

### 2. **GET /api/catalog/product/:id** - Fetch Product Detail
Mengambil detail lengkap satu produk berdasarkan ID.

**Endpoint:** `GET /api/catalog/product/{productId}`

**Path Parameters:**
```
productId (string) - MongoDB ObjectId produk
```

**Example Request:**
```javascript
GET http://localhost:8000/api/catalog/product/65a4c8f9d7e2f5b8c1a2d3e4
```

**Response Success (200):**
```json
{
  "status": "success",
  "message": "Product fetched successfully",
  "data": {
    "id": "65a4c8f9d7e2f5b8c1a2d3e4",
    "name": "ASUS ROG Swift OLED PG27UCDM",
    "description": "Monitor gaming premium...",
    "brand": "ASUS",
    "category": "Monitor",
    "price": 15990000,
    "rating": 4.9,
    "thumbnail": "/products/asus-rog-1.jpg",
    "images": ["url1", "url2", "url3"],
    "features": ["4K UHD 3840×2160", "240Hz Refresh Rate", "0.03ms Response"],
    "overview": ["Full detailed description..."],
    "colors": ["Black", "Silver", "Gray"],
    "isFeatured": true,
    "isBestseller": false,
    "specs": {
      "Panel": "QD-OLED",
      "Resolution": "3840×2160 (4K UHD)",
      "RefreshRate": "240Hz"
    },
    "variants": [
      {"id": 1, "name": "Variant 1", "stock": 5, "price": 15990000}
    ],
    "reviews": [
      {"name": "John", "rating": 5, "date": "2024-01-15", "comment": "Great!"}
    ],
    "availability": {
      "status": "in_stock",
      "label": "Tersedia",
      "color": "green"
    }
  }
}
```

**Response Error (404):**
```json
{
  "status": "error",
  "message": "Product not found",
  "error": "Product with ID 65a4c8f9d7e2f5b8c1a2d3e4 does not exist"
}
```

---

## 🔧 Frontend Integration

### Using catalogService in Components

**File:** `src/services/catalogService.ts`

#### Get All Products
```typescript
import { catalogService } from '@/services/catalogService';

// In your component
const result = await catalogService.getAllProducts({
  page: 1,
  limit: 12,
  category: 'Monitor',
  search: 'ASUS',
  sort: '-createdAt'
});

if (result.success) {
  console.log('Products:', result.data);
  console.log('Total:', result.total);
  console.log('Current page:', result.page);
} else {
  console.error('Error:', result.message);
}
```

#### Get Single Product Detail
```typescript
const result = await catalogService.getProductDetail('65a4c8f9d7e2f5b8c1a2d3e4');

if (result.success) {
  const product = result.data;
  console.log('Product name:', product.name);
  console.log('Price:', product.price);
  console.log('Rating:', product.rating);
} else {
  console.error('Error:', result.message);
}
```

---

## 📊 State Management (ShopContext)

**File:** `src/context/ShopContext.tsx`

Data produk dikelola globally menggunakan Context API:

```typescript
import { useShop } from '@/context/ShopContext';

const MyComponent = () => {
  const {
    products,              // Array produk dari API
    filteredProducts,      // Produk yang sudah difilter
    loading,              // Status loading
    error,                // Pesan error jika ada
    pagination,           // Info pagination
    searchQuery,          // Search input
    setSearchQuery,       // Update search
    selectedCategory,     // Kategori terpilih
    setSelectedCategory,  // Update kategori
    priceRange,          // Price filter
    setPriceRange,       // Update price
    sortBy,              // Current sort
    setSortBy,           // Update sort
    currentPage,         // Halaman saat ini
    setCurrentPage,      // Update halaman
  } = useShop();

  // Tampilkan produk
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>Rp {product.price.toLocaleString('id-ID')}</p>
          <div>Rating: {product.rating} ⭐</div>
        </div>
      ))}
    </div>
  );
};
```

---

## 📄 Pages Menggunakan API

### 1. Products Page (`src/pages/Products.tsx`)
Menampilkan daftar semua produk dengan:
- ✅ Pagination
- ✅ Search by name/brand
- ✅ Filter by category
- ✅ Filter by price range
- ✅ Filter by brand
- ✅ Sort options

**Data Flow:**
```
ShopContext (fetches /api/catalog)
    ↓
Products.tsx (renders products)
    ↓
Product Cards with images, price, rating
```

### 2. Product Detail Page (`src/pages/ProductDetail.tsx`)
Menampilkan detail lengkap satu produk:
- ✅ Product images gallery
- ✅ Full description & specifications
- ✅ Color selection
- ✅ Variant selection
- ✅ Quantity selector
- ✅ Add to cart

**Data Flow:**
```
URL params (productId)
    ↓
catalogService.getProductDetail(productId)
    ↓
Fetch from /api/catalog/product/:id
    ↓
Display full product detail
```

---

## 🎯 Key Features

### Pagination
```javascript
// Halaman berikutnya
const nextPage = () => {
  setCurrentPage(currentPage + 1);
};

// Kembali ke halaman sebelumnya
const prevPage = () => {
  setCurrentPage(Math.max(1, currentPage - 1));
};
```

### Search
```javascript
// Real-time search (debounced)
const handleSearch = (query) => {
  setSearchQuery(query);
  setCurrentPage(1); // Reset ke halaman 1
};
```

### Filtering
```javascript
// Filter by category
const handleCategorySelect = (category) => {
  setSelectedCategory(category);
  setCurrentPage(1);
};

// Filter by price
const handlePriceFilter = (min, max) => {
  setPriceRange([min, max]);
  setCurrentPage(1);
};
```

### Sorting
```javascript
const handleSort = (sortOption) => {
  setSortBy(sortOption);
  setCurrentPage(1);
};

// Available sort options:
// 'default', '-createdAt' (newest), 'price-asc', 'price-desc', 'rating-high'
```

---

## ⚙️ Configuration

### Environment Variables (`.env`)
```
VITE_API_URL=http://localhost:8000/api
```

### Backend Server Requirements
- **Port:** 8000
- **Database:** MongoDB
- **CORS:** Enabled for frontend origin

### Frontend Server
- **Port:** 8080 (production) or 5173 (dev)

---

## 🧪 Testing API Endpoints

### Using cURL
```bash
# Get all products
curl "http://localhost:8000/api/catalog?page=1&limit=12"

# Get Monitor products
curl "http://localhost:8000/api/catalog?category=Monitor"

# Get product detail
curl "http://localhost:8000/api/catalog/product/65a4c8f9d7e2f5b8c1a2d3e4"

# Search products
curl "http://localhost:8000/api/catalog?search=ASUS"
```

### Using Postman
1. Create new request → GET
2. URL: `http://localhost:8000/api/catalog`
3. Add query parameters in "Params" tab
4. Click "Send"

---

## 📝 Response Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Products fetched, Product found |
| 400 | Bad Request | Missing required ID, Invalid query params |
| 404 | Not Found | Product with ID doesn't exist |
| 500 | Server Error | Database connection failed |

---

## 🔍 Troubleshooting

### Products not showing?
1. ✅ Check backend is running on `http://localhost:8000`
2. ✅ Verify `.env` has `VITE_API_URL=http://localhost:8000/api`
3. ✅ Check browser console for errors
4. ✅ Verify MongoDB is connected (check backend logs)
5. ✅ Check network tab in DevTools for API responses

### API returns 404 for product?
1. ✅ Verify product ID is correct MongoDB ObjectId format
2. ✅ Check product exists in database
3. ✅ Try fetching all products to see available IDs

### CORS error?
1. ✅ Backend CORS must be enabled for frontend origin
2. ✅ Check backend `server.js` has correct CORS origin
3. ✅ Restart backend after CORS changes

---

## 📚 Related Files
- Backend: `backend/src/controllers/productController.js`
- Routes: `backend/src/routes/productRoutes.js`
- Service: `src/services/catalogService.ts`
- Context: `src/context/ShopContext.tsx`
- Products Page: `src/pages/Products.tsx`
- Detail Page: `src/pages/ProductDetail.tsx`

---

## 🚀 Summary
✅ Produk ditampilkan dari API `/api/catalog`
✅ Detail produk diambil dari API `/api/catalog/product/:id`
✅ Frontend menggunakan catalogService untuk handle API calls
✅ ShopContext manages product state globally
✅ Support pagination, filtering, search, sorting
