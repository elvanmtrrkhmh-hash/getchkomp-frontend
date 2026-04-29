# 🚀 QUICK START GUIDE - Product Detail End-to-End

## What's Been Built

✅ **Backend**:
- MongoDB Product Model (`backend/src/models/Product.js`)
- Product Controller with CRUD operations
- Product Routes (GET/POST/PUT/DELETE)
- Input Validation middleware
- Data transformation (backend field names → frontend field names)
- Database seeder with 6 sample products

✅ **Frontend**:
- catalogService with data normalization  
- ProductDetail component showing all fields
- Safe fallbacks for empty fields
- Badge display (Featured, Bestseller)

---

## Step-by-Step Setup

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies (if not done)
npm install

# Create .env file if not exists (already should be there)
# Verify these are set:
# MONGODB_URI=mongodb://localhost:27017/tech-komputer-hub
# NODE_ENV=development
# PORT=8000

# Start backend server
npm run dev
```

**Expected Output**:
```
Server running on port 8000
Environment: development
✓ Seeded 6 products successfully
  1. ASUS ROG Swift OLED PG27UCDM (ID: xxx)
  2. TitanDisplay Gaming 27R (ID: xxx)
  3. LG UltraGear 24GN600 (ID: xxx)
  4. Corsair K95 RGB Platinum (ID: xxx)
  5. Razer DeathAdder V3 (ID: xxx)
  6. SteelSeries Arctis 9 (ID: xxx)
```

### 2. Verify Backend API

Open new terminal (keep backend running):

```bash
# Get all products
curl http://localhost:8000/api/catalog

# Get single product (replace {id} with actual MongoDB ID)
curl http://localhost:8000/api/catalog/product/{id}

# Get products by category
curl http://localhost:8000/api/catalog/category/Monitor

# Response should include:
{
  "status": "success",
  "message": "Product fetched successfully",
  "data": {
    "id": "xxx",
    "name": "ASUS ROG Swift OLED...",
    "description": "...",
    "brand": "ASUS",
    "category": "Monitor",
    "price": 15990000,
    "thumbnail": "/products/asus-rog-1.jpg",
    "images": ["/products/asus-rog-1.jpg", ...],
    "features": ["4K UHD", "240Hz", ...],
    "overview": ["Panel QD-OLED...", ...],
    "colors": ["Black", "Silver", "Gray"],
    "rating": 4.9,
    "isFeatured": true,
    "isBestseller": false,
    "specs": {...},
    "reviews": [{name, rating, date, comment}],
    ...
  }
}
```

### 3. Frontend Setup

In another terminal:

```bash
# Navigate to frontend
cd .

# Install dependencies (if not done)
npm install

# Verify .env has correct API URL:
# VITE_API_URL=http://localhost:8000/api
# VITE_API_BASE_URL=http://localhost:8000

# Start frontend dev server
npm run dev
```

**Expected Output**:
```
Local:   http://localhost:5173
Press Enter to view it in browser
```

### 4. Test the Product Detail Page

1. Open browser → http://localhost:5173
2. Navigate to Products page
3. Click on any product → ProductDetail page
4. Verify all data displays correctly:
   - ✅ Thumbnail + Gallery images
   - ✅ Product name
   - ✅ Category badge
   - ✅ Brand
   - ✅ Rating
   - ✅ Price
   - ✅ Availability status
   - ✅ Description
   - ✅ Key features
   - ✅ Overview (in Tab)
   - ✅ Colors
   - ✅ Featured badge (⭐ if featured=true)
   - ✅ Bestseller badge (🔥 if bestseller=true)
   - ✅ Specifications (in Tab)
   - ✅ Reviews (in Tab)
   - ✅ Related products

---

## Testing Specific Fields

### Featured Products
- ASUS ROG Swift OLED → Featured ⭐
- TitanDisplay Gaming 27R → Featured + Bestseller ⭐🔥
- Razer DeathAdder V3 → Bestseller 🔥

### Products by Category
- **Monitor**: ASUS, TitanDisplay, LG
- **Keyboard**: Corsair
- **Mouse**: Razer
- **Headset**: SteelSeries

### Field Mapping Verification

On ProductDetail page, right-click → Inspect → Network tab

Click on product → Look at GET `/api/catalog/product/{id}` response

Verify mapping:
```javascript
// Backend sends these field names:
backend.gallery → frontend.images ✓
backend.key_features → frontend.features ✓
backend.product_overview → frontend.overview ✓
backend.available_colors → frontend.colors ✓
backend.featured → frontend.isFeatured ✓
backend.bestseller → frontend.isBestseller ✓
```

---

## Debugging Common Issues

### Issue: Products not showing
**Solution**:
- Check MongoDB is running: `mongod`
- Check backend logs for errors
- Verify API endpoint responds: `curl http://localhost:8000/api/catalog`

### Issue: Images not loading
**Solution**:
- Images use relative paths from backend
- Frontend prepends VITE_API_BASE_URL
- Check .env has correct VITE_API_BASE_URL=http://localhost:8000

### Issue: TypeScript errors
**Solution**:
- Run `npm run build` to check for errors
- Clear node_modules: `rm -rf node_modules && npm install`

### Issue: CORS errors
**Solution**:
- Backend CORS is set to http://localhost:5173
- Make sure frontend is running on that port
- Check backend logs for CORS errors

---

## API Endpoints Reference

### Public Endpoints (No Auth Required)

**GET** `/api/catalog`
- Query: `page`, `limit`, `category`, `search`, `sort`, `featured`, `bestseller`
- Example: `GET http://localhost:8000/api/catalog?page=1&limit=12&category=Monitor`

**GET** `/api/catalog/product/:id`
- Example: `GET http://localhost:8000/api/catalog/product/xxx`

**GET** `/api/catalog/category/:category`
- Example: `GET http://localhost:8000/api/catalog/category/Monitor`

### Admin Endpoints (Auth Required - not yet built)

**POST** `/api/catalog`
- Body: `{name, description, brand, category, price, thumbnail, gallery[], ...}`

**PUT** `/api/catalog/:id`
- Body: `{name?, description?, price?, ...}`

**DELETE** `/api/catalog/:id`

---

## Frontend Features Checklist

### ProductDetail Component
- [x] Displays all product fields
- [x] Safe fallbacks for empty fields
- [x] Breadcrumb with category link
- [x] Category + Featured + Bestseller badges
- [x] Brand display
- [x] Image gallery with resolution
- [x] Features list with icons
- [x] Tabs for Overview/Specs/Reviews
- [x] Related products section

### catalogService
- [x] Fields mapping (backend → frontend)
- [x] Image path resolution
- [x] Type-safe normalization
- [x] Array/object defaults
- [x] Pagination support
- [x] Search/filter support

---

## Next Steps (Not Yet Built)

⚠️ Still need to build:
- [ ] Admin Create Product form UI
- [ ] Admin Edit/Delete Product UI  
- [ ] Image upload functionality
- [ ] Authentication guard for admin routes
- [ ] Product image storage/serving
- [ ] Search UI in Products page

---

## File Locations

### Backend
- Model: `backend/src/models/Product.js`
- Controller: `backend/src/controllers/productController.js`
- Routes: `backend/src/routes/productRoutes.js`
- Validation: `backend/src/middleware/validation.js`
- Seeder: `backend/src/data/seedProducts.js`
- Server: `backend/src/server.js`

### Frontend
- Service: `src/services/catalogService.ts`
- Component: `src/pages/ProductDetail.tsx`
- Types: `src/data/products.ts`
- Utils: `src/utils/imageUtils.ts`

### Documentation
- Full Audit: `PRODUCT_DETAIL_AUDIT.md`
- This Guide: `PRODUCT_DETAIL_QUICK_START.md`

---

## Success Indicators

Everything is working correctly when:

1. ✅ Backend starts without errors
2. ✅ `curl http://localhost:8000/api/catalog` returns products
3. ✅ Frontend starts without errors
4. ✅ Product page displays all fields from API
5. ✅ Images load correctly
6. ✅ Badges (Featured/Bestseller) display conditionally
7. ✅ Tabs (Overview/Specs/Reviews) work
8. ✅ Related products show with brand and badges
9. ✅ Console has no errors/warnings
10. ✅ No CORS errors in browser dev tools

---

## Troubleshooting

### Clear Everything and Start Fresh

```bash
# Stop services
# Kill backend terminal (Ctrl+C)
# Kill frontend terminal (Ctrl+C)

# Clear MongoDB
# In Mongo shell: use tech-komputer-hub; db.dropDatabase()
# Or: mongosh > db.dropDatabase()

# Restart backend
cd backend && npm run dev

# Restart frontend  
npm run dev
```

---

**Everything is configured and ready to go! 🎉**

Start backend → Start frontend → Navigate to product detail page!
