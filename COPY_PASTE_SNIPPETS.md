# Copy-Paste Ready Code Snippets

Use these snippets untuk integrate image URL resolution di component baru.

---

## 1️⃣ Import Statement

```typescript
// Minimal imports (if only need src attribute)
import { resolveImageUrl, getSafeSrc } from "@/utils/imageUtils";

// Full imports (if need fallback handling)
import { 
  resolveImageUrl, 
  resolveImageUrls,
  getPrimaryImageUrl,
  getSafeSrc, 
  getPlaceholderImage 
} from "@/utils/imageUtils";
```

---

## 2️⃣ Single Image (Product Card Thumbnail)

```tsx
<img 
  src={getSafeSrc(resolveImageUrl(product.thumbnail))}
  alt={product.name}
  onError={(e) => {
    (e.target as HTMLImageElement).src = getPlaceholderImage();
  }}
/>
```

---

## 3️⃣ Image with Fallback (Primary or First)

```tsx
const imageUrl = resolveImageUrl(product.thumbnail) || 
                 resolveImageUrl(product.images?.[0]) || 
                 getPlaceholderImage();

<img 
  src={getSafeSrc(imageUrl)}
  alt={product.name}
/>
```

---

## 4️⃣ Gallery - Multiple Images

```tsx
// State management
const [selectedThumb, setSelectedThumb] = useState(0);

// Image resolution
const resolvedImages = resolveImageUrls(product.images, product.thumbnail);
const thumbnails = resolvedImages.length > 0 ? resolvedImages : [getPlaceholderImage()];
const safeIndex = Math.max(0, Math.min(selectedThumb, thumbnails.length - 1));

// Main image
<div className="aspect-square rounded-lg overflow-hidden">
  <img 
    src={getSafeSrc(thumbnails[safeIndex])}
    alt={product.name}
    className="h-full w-full object-cover"
  />
</div>

// Thumbnail gallery
<div className="grid grid-cols-4 gap-2">
  {thumbnails.map((src, i) => (
    <button
      key={i}
      onClick={() => setSelectedThumb(i)}
      className={`border-2 ${selectedThumb === i ? "border-primary" : "border-gray-300"}`}
    >
      <img 
        src={getSafeSrc(src)}
        alt={`Thumbnail ${i + 1}`}
        className="w-full h-full object-cover"
      />
    </button>
  ))}
</div>
```

---

## 5️⃣ Carousel Component

```tsx
import { useState } from "react";
import { resolveImageUrl, resolveImageUrls, getSafeSrc, getPlaceholderImage } from "@/utils/imageUtils";

export const ProductCarousel = ({ product }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = resolveImageUrls(product.images, product.thumbnail);
  const images = slides.length > 0 ? slides : [getPlaceholderImage()];

  const next = () => setCurrentIndex((i) => (i + 1) % images.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="relative w-full">
      <img 
        src={getSafeSrc(images[currentIndex])}
        alt="carousel"
        className="w-full h-auto"
      />
      
      <button onClick={prev} className="absolute left-0 top-1/2">←</button>
      <button onClick={next} className="absolute right-0 top-1/2">→</button>

      <div className="flex gap-2 mt-2">
        {images.map((src, i) => (
          <img
            key={i}
            src={getSafeSrc(src)}
            alt={`slide ${i}`}
            className={`w-16 h-16 cursor-pointer ${currentIndex === i ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
      </div>
    </div>
  );
};
```

---

## 6️⃣ Product Grid

```tsx
import { resolveImageUrl, getSafeSrc, getPlaceholderImage } from "@/utils/imageUtils";

export const ProductGrid = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg overflow-hidden">
          <img
            src={getSafeSrc(
              resolveImageUrl(product.thumbnail) || 
              resolveImageUrl(product.images?.[0])
            )}
            alt={product.name}
            className="w-full h-40 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = getPlaceholderImage();
            }}
          />
          <div className="p-4">
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-lg text-blue-600">${product.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
```

---

## 7️⃣ Image Component (Reusable)

```tsx
import { resolveImageUrl, getSafeSrc, getPlaceholderImage } from "@/utils/imageUtils";
import { ImgHTMLAttributes } from "react";

interface ProductImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null;
  fallbackSrc?: string | null;
  resolveUrl?: boolean;
}

export const ProductImage = ({
  src,
  fallbackSrc,
  resolveUrl = true,
  className = "w-full h-auto",
  ...props
}: ProductImageProps) => {
  const imageSrc = resolveUrl
    ? getSafeSrc(resolveImageUrl(src) || resolveImageUrl(fallbackSrc))
    : getSafeSrc(src || fallbackSrc || getPlaceholderImage());

  return (
    <img
      src={imageSrc}
      className={className}
      onError={(e) => {
        (e.target as HTMLImageElement).src = getPlaceholderImage();
      }}
      {...props}
    />
  );
};

// Usage
<ProductImage src={product.thumbnail} fallbackSrc={product.images?.[0]} />
<ProductImage src={product.images?.[0]} className="w-64 h-64 object-cover rounded-lg" />
```

---

## 8️⃣ Featured Products Section

```tsx
import { resolveImageUrl, getSafeSrc, getPlaceholderImage } from "@/utils/imageUtils";

export const FeaturedSection = ({ products }) => {
  return (
    <section className="py-20">
      <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
      
      <div className="grid grid-cols-4 gap-6">
        {products.filter(p => p.isFeatured).map((product) => (
          <div key={product.id} className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
            {/* Image */}
            <div className="relative aspect-square bg-gray-100">
              <img
                src={getSafeSrc(
                  resolveImageUrl(product.thumbnail) ||
                  resolveImageUrl(product.images?.[0])
                )}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getPlaceholderImage();
                }}
              />
              
              {product.isBestseller && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Bestseller
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{product.name}</h3>
              <p className="text-xl text-blue-600 font-bold">${product.price}</p>
              <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
```

---

## 9️⃣ Image with Fallback Chain

```tsx
/**
 * Resolve image dengan custom fallback chain
 * 1. Try primary image
 * 2. Try first image dari array
 * 3. Try thumbnail
 * 4. Show placeholder
 */
const resolvePrimaryImage = (product: Product): string => {
  const urls = [
    resolveImageUrl(product.thumbnail),
    resolveImageUrl(product.images?.[0]),
    getPlaceholderImage()
  ].filter(Boolean);
  
  return urls[0] || getPlaceholderImage();
};

// Usage
<img src={getSafeSrc(resolvePrimaryImage(product))} alt="product" />
```

---

## 🔟 Hero Banner with Image

```tsx
import { resolveImageUrl, getSafeSrc, getPlaceholderImage } from "@/utils/imageUtils";

export const HeroBanner = ({ banner }) => {
  return (
    <div className="relative w-full h-96 overflow-hidden rounded-2xl">
      <img
        src={getSafeSrc(resolveImageUrl(banner.image))}
        alt={banner.title}
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = getPlaceholderImage();
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">{banner.title}</h1>
          <p className="text-xl mb-6">{banner.subtitle}</p>
          <button className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-100">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

## Advanced: Image with Lazy Loading

```tsx
import { resolveImageUrl, getSafeSrc, getPlaceholderImage } from "@/utils/imageUtils";
import { useEffect, useRef, useState } from "react";

export const LazyProductImage = ({ src, fallback }: { src?: string; fallback?: string }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && imgRef.current) {
          imgRef.current.src = getSafeSrc(
            resolveImageUrl(src) || resolveImageUrl(fallback)
          );
          observer.stop();
        }
      },
      { rootMargin: "50px" }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, fallback]);

  return (
    <img
      ref={imgRef}
      src={getPlaceholderImage()}
      alt="product"
      className={`w-full h-auto transition-opacity ${isLoaded ? "opacity-100" : "opacity-50"}`}
      onLoad={() => setIsLoaded(true)}
      onError={(e) => {
        (e.target as HTMLImageElement).src = getPlaceholderImage();
      }}
    />
  );
};
```

---

## Error Handling Pattern

```tsx
import { resolveImageUrl, getSafeSrc, getPlaceholderImage } from "@/utils/imageUtils";
import { useState } from "react";

export const RobustProductImage = ({ product }) => {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const imageUrl = getSafeSrc(
    resolveImageUrl(product.thumbnail) ||
    resolveImageUrl(product.images?.[0])
  );

  return (
    <div className="relative bg-gray-200 aspect-square rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-gray-300" />
      )}

      <img
        src={error ? getPlaceholderImage() : imageUrl}
        alt={product.name}
        className="w-full h-full object-cover"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
      />

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-gray-500">Image unavailable</span>
        </div>
      )}
    </div>
  );
};
```

---

## Next Click Pattern (Product Detail)

```tsx
import { resolveImageUrl, resolveImageUrls, getSafeSrc, getPlaceholderImage } from "@/utils/imageUtils";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const ProductImageViewer = ({ product }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = resolveImageUrls(product.images, product.thumbnail);
  const pictures = images.length > 0 ? images : [getPlaceholderImage()];

  const handlePrev = () => {
    setCurrentIndex((i) => (i - 1 + pictures.length) % pictures.length);
  };

  const handleNext = () => {
    setCurrentIndex((i) => (i + 1) % pictures.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
        <img
          src={getSafeSrc(pictures[currentIndex])}
          alt={`${product.name} - View ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getPlaceholderImage();
          }}
        />

        {/* Navigation Buttons (only show if multiple images) */}
        {pictures.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow hover:shadow-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow hover:shadow-lg"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-2 right-2 bg-black text-white px-3 py-1 rounded text-sm">
              {currentIndex + 1} / {pictures.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {pictures.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {pictures.map((pic, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`flex-shrink-0 w-20 h-20 rounded border-2 transition-colors ${
                currentIndex === idx ? "border-blue-500" : "border-gray-300"
              }`}
            >
              <img
                src={getSafeSrc(pic)}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover rounded"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## Copy-Paste Tips

1. **Change imports path if needed**
   ```typescript
   // Jika imageUtils di folder berbeda, sesuaikan path
   import { ... } from "@/utils/imageUtils";
   ```

2. **Update className sesuai Tailwind setup**
   ```tsx
   // Use classnames yang sesuai dengan project Anda
   className="w-full h-auto" // Sesuaikan dengan design system
   ```

3. **Adjust image aspect ratio**
   ```tsx
   // Common ratios:
   // aspect-square    - 1:1
   // aspect-video     - 16:9
   // aspect-[4/3]     - 4:3
   // aspect-[3/2]     - 3:2
   ```

4. **Test dengan berbagai backend response format**

---

## Quick Integration Checklist

- [ ] Copy snippet yang sesuai
- [ ] Update import paths
- [ ] Update Tailwind classes
- [ ] Test dengan dev server
- [ ] Verify images tampil
- [ ] Check browser console untuk errors
- [ ] Commit ke git

---

**All snippets ready to use! Just copy, paste, and adjust for your needs.** 🚀
