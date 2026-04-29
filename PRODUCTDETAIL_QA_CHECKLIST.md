# ProductDetail - QA Testing Checklist

## Pre-Test Setup
- [ ] Backend API running and accessible
- [ ] Frontend dev server running: `npm run dev`
- [ ] Browser DevTools open (F12)
- [ ] Network tab ready to inspect requests

## 🔍 API Response Validation

### Check Network Response
1. Open browser → Product Detail page
2. Network tab → Find `catalog/product/1` request
3. Response should include:

```json
{
  "data": {
    "id": 1,
    "name": "Product Name",
    "price": 15990000 OR "selling_price": 15990000,
    "description": "...",
    "key_features": ["Feature 1", "Feature 2"],
    "available_colors": ["Black", "Silver"],
    "product_overview": ["Overview 1", "Overview 2"],
    "product_options": {
      "HDR Mode": ["DisplayHDR 400"],
      "Refresh Rate": ["60Hz", "120Hz", "240Hz"],
      "Panel": ["QD-OLED"]
    },
    "thumbnail": "image.jpg",
    "gallery": ["img1.jpg", "img2.jpg"],
    "stock": 5,
    "brand": "Asus" or { "name": "Asus" },
    "category": "Monitor" or { "name": "Monitor" }
  }
}
```

- [ ] Status code: 200
- [ ] Response includes all fields above
- [ ] Images are accessible (200 status)

## ✅ Frontend Display Rendering

### Basic Information
- [ ] **Product Name** displays correctly
- [ ] **Description** visible (not empty)
- [ ] **Price** shows actual value (not Rp 0)
  - Verify: Should be Rp 15.990.000 or similar
- [ ] **Brand** displays (e.g., "Brand: Asus")
- [ ] **Category** shows (e.g., "Monitor")
- [ ] **Rating** displays with stars (e.g., 4.9/5.0)

### Badges & Status
- [ ] **Featured Badge** shows (if isFeatured = true)
- [ ] **Bestseller Badge** shows (if isBestseller = true)
- [ ] **Availability Status** correct
  - If stock > 0: "✓ Tersedia" (green)
  - If stock = 0: "Habis" (red)

### Images
- [ ] **Main image** loads and displays
- [ ] **Thumbnail gallery** exists (if multiple images)
- [ ] **Click thumbnails** → main image updates
- [ ] **Broken image fallback** shown if image fails

### Product Sections

#### Features Section (if has key_features)
- [ ] "Key Features" header visible
- [ ] All features listed with checkmarks
- [ ] Example: "240Hz Refresh Rate", "0.03ms Response Time"

#### Variants Section (ONLY if has real variants)
**⚠️ IMPORTANT**: Section should NOT appear if product has NO variants

- [ ] If backend sends `variants: []` → Section HIDDEN ✅
- [ ] If backend sends `variants` with data:
  - [ ] "Select Product Variant" header shows
  - [ ] Each variant displays as button/card
  - [ ] Shows: Variant name, price, stock status
  - [ ] Example format: "Storage 256GB - Rp 1.000.000 (5 in stock)"
  - [ ] Can click to select variant

#### Colors Section (if has available_colors)
- [ ] "Color" label visible
- [ ] Each color shown as button
- [ ] Example: [Black] [Silver] [Gray]
- [ ] Can click to toggle selection
- [ ] If no colors → section hidden

#### Specifications Section (if has product_options)
**⚠️ IMPORTANT**: Options should NOT be in Variants section

- [ ] "Specifications" header visible
- [ ] Each option category shows as group
- [ ] Each option value as pill/button
- [ ] Example layout:
  ```
  Specifications
  
  HDR Mode: [DisplayHDR 400 True Black]
  Refresh Rate: [60Hz] [120Hz] [144Hz] [240Hz]
  Panel: [QD-OLED]
  ```
- [ ] Can click to select option

### Tabs Section
#### Overview Tab
- [ ] Content shows product_overview items
- [ ] If no overview → shows description instead

#### Specifications Tab
- [ ] Shows specs as key-value pairs
- [ ] Example: "Panel: QD-OLED", "Resolution: 3840×2160"

#### Reviews Tab
- [ ] Shows all reviews
- [ ] Each review has: name, rating (stars), date, comment

## 🛒 Add to Cart Functionality

### Quantity Control
- [ ] **Minus button** works (qty decreases, min = 1)
- [ ] **Plus button** works (qty increases)
- [ ] **Input field** shows current qty

### Add to Cart Action
- [ ] **Button enabled** when can add (variants selected if required)
- [ ] **Button disabled** when should not add (variant required but not selected)
- [ ] **Click button** → Navigates to cart page
- [ ] **Cart shows** correct items with:
  - [ ] Product name
  - [ ] Correct price (not Rp 0)
  - [ ] If variant: name includes variant info

### Price Verification
```
Add to Cart Flow:
1. Open product detail (e.g., Monitor - Rp 15.990.000)
2. Try to add to cart
3. Check cart page:
   - Product price = Rp 15.990.000 ✅
   - NOT Rp 0 ❌
4. Increase qty to 3
5. Total = Rp 15.990.000 × 3 = Rp 47.970.000 ✅
```

## 🔴 Error & Edge Cases

### Missing Data Handling
- [ ] **No description** → Shows placeholder or empty gracefully
- [ ] **No features** → Section hidden
- [ ] **No colors** → Section hidden
- [ ] **No options** → Section hidden
- [ ] **No reviews** → Shows "No reviews yet"
- [ ] **Missing image** → Shows fallback placeholder
- [ ] **Price = 0** → Shows Rp 0 or fallback value
- [ ] **No variants** → Variants section hidden

### Invalid Product
- [ ] **Invalid product ID** (e.g., /product/99999)
  - [ ] Shows error message
  - [ ] "Back to Products" button available
  - [ ] No crash/white screen

### Network Issues
- [ ] **Slow API** → Loading spinner shown
- [ ] **API error** → Error message displayed
- [ ] **Image timeout** → Fallback image shown

## 📊 Console Checks

### Network Tab
- [ ] No 404 errors
- [ ] No 500 errors
- [ ] API response time reasonable (< 2s)
- [ ] Images: All have 200 status (or cached)

### Console Tab
- [ ] No red errors
- [ ] Warnings only (can ignore Browserslist warning)
- [ ] No CORS issues

### Application Tab
- [ ] LocalStorage has cart data (if added item)
- [ ] No excessive memory usage

## 🎯 Normalization Verification

### Field Mapping Test
```
Backend field          →  Frontend field    Display Location
────────────────────────────────────────────────────────
key_features           →  features          Key Features section
available_colors       →  colors            Color buttons
product_overview       →  overview          Overview tab
product_options        →  options           Specifications section
selling_price          →  price             Price display
gallery                →  images            Image gallery
stock                  →  availability      Availability status
is_featured            →  isFeatured        Featured badge
is_bestseller          →  isBestseller      Bestseller badge
```

- [ ] Each field maps correctly
- [ ] No field appears in wrong place (e.g., options NOT in variants)

## 🚀 Final Verification

### Cross-Browser Testing
- [ ] Chrome: ✅
- [ ] Firefox: ✅
- [ ] Edge: ✅
- [ ] Safari (if Mac): ✅

### Responsive Design
- [ ] Desktop (1920×1080): ✅
- [ ] Tablet (768×1024): ✅
- [ ] Mobile (375×667): ✅

### Performance
- [ ] Page load time: < 3 seconds
- [ ] Image load: < 5 seconds
- [ ] No layout shift after load
- [ ] Smooth interactions (no lag)

## 📝 Sign-Off

| Item | Status | Date | Notes |
|------|--------|------|-------|
| API Response Valid | [ ] | | |
| All Fields Display | [ ] | | |
| Variants Section | [ ] | | |
| Colors Section | [ ] | | |
| Options Section | [ ] | | |
| Price Accurate | [ ] | | |
| Stock Status Correct | [ ] | | |
| Add to Cart Works | [ ] | | |
| No Console Errors | [ ] | | |
| Cross-Browser OK | [ ] | | |
| Responsive Design | [ ] | | |

**Tested By**: ________________  
**Date**: ________________  
**Status**: [ ] PASS  [ ] FAIL  

---

## 🐛 Issue Reporting Template

If issues found during QA:

```
Issue Title: [Brief title]
Severity: [ ] Critical [ ] High [ ] Medium [ ] Low

Reproduction Steps:
1. ...
2. ...
3. ...

Expected: [What should happen]
Actual: [What actually happened]

Screenshots/Video: [Attach]
Browser: [Chrome/Firefox/etc]
OS: [Windows/Mac/Linux]

Backend Response Sample: [Paste JSON response]
```

---

**Test Date**: _________  
**Status**: Ready for Production ✅ or Needs Fixes ❌
