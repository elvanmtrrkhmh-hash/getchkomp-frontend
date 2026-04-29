# Quick Start: Backend API Integration for Products

## What Changed?

### Before
- Products page used mock data from `src/data/products.ts`
- No real pagination
- No server-side filtering
- No error recovery

### After
- **Products page uses backend API** `GET /api/catalog` as primary source
- **Pagination:** Page navigation with API-driven data
- **Smart Filtering:** Search, category, sort sent to API
- **Edge Cases:** Price NaN, object fields, URLs all handled
- **Fallback:** Mock data only used if API fails

---

## How to Test

### Terminal 1: Backend
```bash
cd backend
npm run dev
```
Expected: Server running on `http://localhost:8000`

### Terminal 2: Frontend
```bash
npm run dev
```
Expected: App running on `http://localhost:5173`

### Browser
1. Navigate to http://localhost:5173/products
2. You should see products from API (not mock data)
3. Try:
   - Searching for "monitor"
   - Filtering by category
   - Sorting by price
   - Pagination: Click page 2, 3, etc.

---

## Key Components Modified

### 1. ShopContext (`src/context/ShopContext.tsx`)
**New:**
- Pagination state: `currentPage`, `pageSize`, `pagination`
- API tracking: `loading`, `error`, `usingMockData`
- Smart fetching: `fetchProducts()` with query params
- Auto-refetch when filters change

**Usage in component:**
```typescript
const { 
  products,           // Current page data
  pagination,         // { total, page, limit, lastPage }
  currentPage,        // Current page number
  setCurrentPage,     // Navigate to page
  loading,            // Loading state
  error,              // Error message
  usingMockData      // Using fallback?
} = useShop();
```

### 2. Products Page (`src/pages/Products.tsx`)
**New:**
- Pagination controls (Previous/Next/Page buttons)
- Error banner with API status
- "Mock Data" indicator when fallback used
- Shows: "Showing X of Y products"

### 3. ProductNormalizer (`src/utils/productNormalizer.ts`)
**Enhanced:**
- Price: No more NaN values
- Category/Brand: Handles objects `{ name: '...' }`
- Images: Absolute URL resolution
- Rating: Validated and clamped 0-5

### 4. catalogService (`src/services/catalogService.ts`)
**Verified working with:**
- `page`: Pagination page number
- `limit`: Items per page
- `category`: Category filter
- `search`: Full-text search
- `sort`: Sort order (price-asc, price-desc, rating)

---

## API Query Parameters

When user filters/searches/sorts:

```
// User searches "gaming"
setSearchQuery("gaming")
→ API: GET /api/catalog?page=1&limit=12&search=gaming

// User filters "Monitor"
setSelectedCategory("Monitor")
→ API: GET /api/catalog?page=1&limit=12&category=Monitor

// User sorts "Price: High to Low"
setSortBy("price-desc")
→ API: GET /api/catalog?page=1&limit=12&sort=price-desc

// Combined: Search + Category + Sort
→ API: GET /api/catalog?page=1&limit=12&search=gaming&category=Monitor&sort=price-desc
```

---

## Data Field Mapping

Backend fields → Frontend interface:

| Backend | Frontend | Normalization |
|---------|----------|---|
| `_id` / `id` | `id` | Number |
| `price` | `price` | Number (no NaN) |
| `rating` | `rating` | Number 0-5 (Half-star support) |
| `category` | `category` | String (handles objects) |
| `brand` | `brand` | String (handles objects) |
| `thumbnail` | `thumbnail` | Absolute URL |
| `gallery` / `images` | `images` | Array of absolute URLs |
| `key_features` | `features` | String array |
| `available_colors` | `colors` | String array |
| `product_overview` | `overview` | String array |
| `stock` | `availability` | Object { status, label, color } |
| `featured` / `is_featured` | `isFeatured` | Boolean |
| `bestseller` / `is_bestseller` | `isBestseller` | Boolean |

---

## Error Handling - Fallback to Mock Data

**When API fails:**
1. Catches error in `fetchProducts()`
2. Sets `products = mockProducts`
3. Sets `usingMockData = true`
4. Shows error banner: "⚠️ Error loading products from API"
5. Displays "ℹ️ Showing mock data as fallback"

**User sees:**
- Products still render (using mock data)
- Red error banner at top
- "Mock Data" badge in product count
- Full shopping experience still works

---

## Pagination Example

**Page 1 (Initial):**
```
GET /api/catalog?page=1&limit=12
→ Shows products 1-12
→ Pagination shows: [1] 2 3 4 5 ... [Next]
```

**Click Page 2:**
```
GET /api/catalog?page=2&limit=12
→ Shows products 13-24
→ Pagination shows: [Prev] 1 [2] 3 4 5 ... [Next]
```

**With Filter (Category + Search):**
```
GET /api/catalog?page=1&limit=12&category=Monitor&search=gaming
→ Shows filtered products page 1
→ Click page 2:
GET /api/catalog?page=2&limit=12&category=Monitor&search=gaming
→ Shows filtered products page 2
```

---

## ProductDetail Integration

ProductDetail.tsx already fetches individual products from API:
```typescript
const result = await catalogService.getProductDetail(id);
setProduct(result.data);
```

**Same normalizer applies** for consistent field mapping.

---

## What's NOT Changed (But Still Works)

- ✅ StarRating component (decimal ratings)
- ✅ Price formatting
- ✅ Image utilities
- ✅ Cart functionality
- ✅ All UI components
- ✅ Routing

---

## Verification Steps

### 1. Check Products Loading
```
Open: http://localhost:5173/products
Look for: Product cards with real data (not mock)
```

### 2. Check API Calls
```
Open: Browser DevTools → Network tab
Filter: xhr/fetch
Action: Refresh products page
Verify: GET /api/catalog request succeeds
Check: Response has products.data array
```

### 3. Check Pagination
```
Action: Navigate to page 2
Verify: Products change
Verify: Page 2 button is highlighted
Verify: Request sent with ?page=2&limit=12
```

### 4. Check Filters
```
Action: Type "monitor" in search
Verify: API called with ?search=monitor
Verify: Products filtered (fewer results)

Action: Select category "Monitor"
Verify: API called with ?category=Monitor
Verify: Products filtered

Action: Sort by price
Verify: API called with ?sort=price-asc or desc
Verify: Products sorted
```

### 5. Check Error Handling (Optional)
```
Action: Stop backend (Ctrl+C in backend terminal)
Action: Refresh products page
Verify: Error banner shown
Verify: Mock data displayed
Verify: "Mock Data" indicator visible
Verify: No console errors
```

---

## Common Issues & Solutions

### Issue: Still showing mock data banner
**Check:**
- Is backend running? `http://localhost:8000/api/catalog` accessible?
- Check Network tab - what's the response?
- Check console for fetch errors

### Issue: Blank products page
**Check:**
- Did backend return `status: 'success'`?
- Is response.products.data an array?
- Check console errors

### Issue: Prices showing "NaN"
**Check:**
- Backend sending `price` as number not string?
- Check normalizer handling fallback fields

### Issue: Images not loading
**Check:**
- Images relative or absolute?
- Check `resolveImageUrl()` function
- Browser Network tab for 404s

### Issue: Pagination buttons not working
**Check:**
- Backend returning meta with pagination info?
- Check `setCurrentPage()` is being called
- Verify page parameter in API request

---

## Files to Review

1. **ShopContext.tsx** - Main integration point
   - Query param sync
   - Pagination state
   - API calling logic

2. **Products.tsx** - UI rendering
   - Pagination controls
   - Error display
   - Mock data indicator

3. **catalogService.ts** - API service
   - Query param building
   - Response mapping

4. **productNormalizer.ts** - Data transformation
   - Field mapping
   - Edge case handling

---

## Next Steps

1. **Test fully** using steps above
2. **Monitor console** for any errors
3. **Check Network tab** for API requests
4. **Verify** all filters work (search, category, sort)
5. **Test pagination** works correctly
6. **Test error recovery** (optional: stop backend)

**Ready to use!** 🚀
