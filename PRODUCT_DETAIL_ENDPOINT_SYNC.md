# Product Detail API Endpoint - Troubleshooting & Sync Guide

## ✅ Current Setup (Synced)

### Backend Route
**File:** `backend/src/routes/productRoutes.js`
```javascript
// GET single product by ID
// Endpoint: GET /api/catalog/product/:id
router.get('/catalog/product/:id', getProductDetail);
```

**Controller:** `backend/src/controllers/productController.js`
```javascript
export const getProductDetail = async (req, res) => {
  // Validates product ID
  // Queries MongoDB: Product.findById(id)
  // Returns: { status: 'success', data: transformedProduct }
}
```

### Frontend Service
**File:** `src/services/catalogService.ts`
```typescript
getProductDetail: async (productId: number | string) => {
  const response = await fetch(`${API_URL}/catalog/product/${productId}`, {
    method: 'GET',
    // Parses response: result.data
  });
}
```

**API URL:** Configured in `.env`
```
VITE_API_URL=http://localhost:8000/api
```

### Frontend Component
**File:** `src/pages/ProductDetail.tsx`
```typescript
const { id } = useParams<{ id: string }>();
// Calls: catalogService.getProductDetail(id)
// Loads product and renders detail page
```

---

## 🧪 Testing Endpoints

### Test 1: API Health Check
```bash
curl http://localhost:8000/api/health
# Should return: { status: 'OK', message: 'Server is running' }
```

### Test 2: Available Routes Debug
```bash
curl http://localhost:8000/api/debug/routes
# Shows all available endpoints
```

### Test 3: Product List (to get valid IDs)
```bash
curl "http://localhost:8000/api/catalog?limit=5"
# Copy one of the product IDs from the response
```

### Test 4: Get Product Detail (Replace PRODUCT_ID with actual ID)
```bash
# Example with ObjectId
curl "http://localhost:8000/api/catalog/product/65a4c8f9d7e2f5b8c1a2d3e4"

# Response should be:
# {
#   "status": "success",
#   "message": "Product fetched successfully",
#   "data": {
#     "id": "65a4c8f9d7e2f5b8c1a2d3e4",
#     "name": "Product Name",
#     "price": 3199000,
#     ...
#   }
# }
```

### Test 5: Debug Endpoint (Test Routing)
```bash
curl "http://localhost:8000/api/debug/catalog/product/test123"
# Should return debug info if routing works
```

---

## 🔍 Debugging Steps

### Step 1: Backend Logs
Start backend with logs visible:
```bash
cd backend
npm start  # or bun start
```

Look for these logs:
```
[2026-04-17T10:30:45.123Z] GET /api/catalog/product/65a4c8f9...
[getProductDetail] Called with ID: "65a4c8f9..." (type: string)
[getProductDetail] Searching for product in database with ID: 65a4c8f9...
[getProductDetail] Product found: ASUS ROG Swift OLED
```

### Step 2: Frontend Console
Open browser DevTools (F12) and check Console tab:
```
[catalogService.getProductDetail] Fetching from: http://localhost:8000/api/catalog/product/65a4c8f9...
[catalogService.getProductDetail] Response status: 200
[catalogService.getProductDetail] Successfully fetched product: ASUS ROG Swift OLED
[ProductDetail] Successfully loaded product: ASUS ROG Swift OLED
```

### Step 3: Network Tab
Open Network tab in DevTools:
1. Navigate to product detail page
2. Look for request to `catalog/product/...`
3. Check:
   - **URL:** Should be `http://localhost:8000/api/catalog/product/{id}`
   - **Method:** GET
   - **Status:** 200 (success) or 404 (not found)
   - **Response:** Should have `status: "success"` and `data` object

---

## ⚠️ Common Issues & Solutions

### Issue 1: 404 - Route Not Found
**Error Message:** `The route api/catalog/product/... could not be found`

**Causes & Solutions:**
```
1. Backend server not running
   → Start: npm start (in backend folder)
   → Check: curl http://localhost:8000/api/health

2. Wrong API URL in frontend .env
   → Check: VITE_API_URL=http://localhost:8000/api
   → Port mismatch (not 8000)
   → Host mismatch (not localhost)

3. Routes not properly imported
   → Verify: backend/src/routes/productRoutes.js exports router
   → Verify: backend/src/server.js imports productRoutes

4. Database not connected / Products not seeded
   → Check backend logs for MongoDB connection status
   → Seed products: Should happen automatically on server start
```

### Issue 2: 404 - Product ID Not Found
**Error Message:** `Product with ID {id} does not exist`

**Causes & Solutions:**
```
1. Using wrong ID format
   → Use MongoDB ObjectId: 65a4c8f9d7e2f5b8c1a2d3e4
   → Not: integer like 1, 2, 3
   → Get valid IDs from: GET /api/catalog?limit=5

2. Product not in database
   → Run seeding: Check backend logs on start
   → Manual seed: Call MongoDB directly
   → Verify count: curl http://localhost:8000/api/catalog?limit=1

3. ID encoding issue
   → Check: ID should be plain string without encoding
   → URL should be: /api/catalog/product/65a4c8f9d7e2f5b8c1a2d3e4
```

### Issue 3: CORS Error
**Error Message:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
```
1. Backend CORS not configured
   → Check: backend/src/server.js CORS setup
   → Verify origin: http://localhost:5173 or http://localhost:8080

2. Frontend port mismatch with CORS origin
   → Update backend CORS_ORIGIN env variable
   → Restart backend

3. Check .env:
   VITE_API_URL=http://localhost:8000/api (backend)
```

### Issue 4: 500 - Server Error
**Error Message:** `Failed to fetch product`

**Check Backend Logs:**
```
- Database connection failed
- Product query error
- Data transformation error

Fix: Check MongoDB connection and ensure products are seeded
```

---

## 📋 Endpoint Sync Checklist

- [x] Backend route defined: `/catalog/product/:id`
- [x] Backend controller implemented: `getProductDetail`
- [x] Frontend service calling: `${API_URL}/catalog/product/${productId}`
- [x] Frontend component using: `catalogService.getProductDetail(id)`
- [x] Environment variable set: `VITE_API_URL=http://localhost:8000/api`
- [x] Error handling added in service
- [x] Error display in component
- [x] Debug logging in frontend service
- [x] Debug logging in backend controller
- [x] Debug middleware in backend server
- [x] Debug endpoints for routing verification

---

## 🚀 How to Verify Everything Works

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```
   Look for: `✓ Products already seeded` or seed logs

2. **Start Frontend:**
   ```bash
   npm run dev
   # or
   bun dev
   ```

3. **Navigate to Products Page:**
   - Go to `/products`
   - You should see product list from API

4. **Click "Lihat Detail" on any product:**
   - Should navigate to `/product/{id}`
   - Product detail page should load with data from API
   - Check browser console (F12) for success logs

5. **Verify in Console:**
   ```
   ✓ [catalogService.getProductDetail] Successfully fetched product: ...
   ✓ [ProductDetail] Successfully loaded product: ...
   ```

---

## 📝 Summary

| Component | Endpoint | Status |
|-----------|----------|--------|
| Backend Route | GET /api/catalog/product/:id | ✅ Defined |
| Backend Controller | getProductDetail | ✅ Implemented |
| Frontend Service | catalogService.getProductDetail | ✅ Calling correct URL |
| Frontend Component | ProductDetail | ✅ Using correct service |
| Environment Config | VITE_API_URL | ✅ Set in .env |
| Debugging | Logs & Debug Endpoints | ✅ Added |

**Everything is synced! System should work end-to-end.** 🎉
