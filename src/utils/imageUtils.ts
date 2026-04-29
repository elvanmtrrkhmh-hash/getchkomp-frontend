/**
 * Resolve image URL - handle both full URLs and relative paths
 * @param imagePath - Image path from server (e.g., "products/asus.jpg" or "http://...")
 * @returns Valid image URL or empty string
 */
export const resolveImageUrl = (imagePath?: string | null): string => {
  if (!imagePath || typeof imagePath !== 'string') {
    return '';
  }

  // Already a full URL (http://, https://, etc.)
  if (/^https?:\/\//.test(imagePath)) {
    return imagePath;
  }

  // Data URL
  if (/^data:/.test(imagePath)) {
    return imagePath;
  }

  // Relative path - prepend base URL
  const baseURL = import.meta.env.VITE_API_URL;
  
  // Remove leading slash if exists to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  return `${baseURL}/${cleanPath}`;
};

/**
 * Get list of resolved image URLs from product
 * @param images - Array of image paths
 * @param fallbackThumbnail - Thumbnail path as fallback
 * @returns Array of valid image URLs
 */
export const resolveImageUrls = (
  images?: string[] | null,
  fallbackThumbnail?: string | null
): string[] => {
  const imageArr: string[] = [];

  // Add all images if available
  if (Array.isArray(images) && images.length > 0) {
    images.forEach((img) => {
      const resolved = resolveImageUrl(img);
      if (resolved) {
        imageArr.push(resolved);
      }
    });
  }

  // Add fallback thumbnail if no images
  if (imageArr.length === 0 && fallbackThumbnail) {
    const resolved = resolveImageUrl(fallbackThumbnail);
    if (resolved) {
      imageArr.push(resolved);
    }
  }

  return imageArr;
};

/**
 * Get primary image (for thumbnails, featured sections, etc)
 * @param images - Array of image paths
 * @param thumbnail - Thumbnail path as fallback
 * @returns Single resolved image URL or empty string
 */
export const getPrimaryImageUrl = (
  images?: string[] | null,
  thumbnail?: string | null
): string => {
  // Try to get first image
  if (Array.isArray(images) && images.length > 0) {
    const resolved = resolveImageUrl(images[0]);
    if (resolved) return resolved;
  }

  // Fallback to thumbnail
  if (thumbnail) {
    const resolved = resolveImageUrl(thumbnail);
    if (resolved) return resolved;
  }

  return '';
};

/**
 * Placeholder SVG for missing images
 */
export const getPlaceholderImage = (): string => {
  return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="500" height="500"%3E%3Crect fill="%23e5e7eb" width="500" height="500"/%3E%3Ctext x="250" y="250" text-anchor="middle" dy=".3em" fill="%23999" font-size="20"%3EImage Not Available%3C/text%3E%3C/svg%3E';
};

/**
 * Safe image tag src with fallback
 * @param url - Image URL
 * @returns Image URL or placeholder
 */
export const getSafeSrc = (url: string): string => {
  return url || getPlaceholderImage();
};
