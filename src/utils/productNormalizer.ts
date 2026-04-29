/**
 * Product Data Normalizer
 * Handles mapping between backend field names and frontend Product interface
 * 
 * Backend Field Name Mappings:
 * - key_features → features
 * - available_colors → colors
 * - product_overview → overview
 * - product_options → options
 * - selling_price/cost_price → price
 * - stock → availability
 * - gallery → images
 */

import type { Review } from '@/data/products';

export interface RawProductData extends Record<string, unknown> {
  // Standard fields
  id?: number;
  name?: string;
  price?: number;
  selling_price?: number;
  cost_price?: number;
  category?: string | Record<string, unknown>;
  rating?: number;
  brand?: string | Record<string, unknown>;
  description?: string;
  thumbnail?: string;
  image?: string;
  images?: string[];
  gallery?: string[];
  
  // Backend field names
  key_features?: string[];
  available_colors?: string[];
  product_overview?: string[];
  product_options?: Record<string, string[]>;
  
  // Frontend field names (fallback)
  features?: string[];
  colors?: string[];
  overview?: string[];
  options?: Record<string, string[]>;
  
  // Other fields
  stock?: number;
  availability?: Record<string, unknown>;
  reviews?: Array<Record<string, unknown>>;
  specs?: Record<string, string>;
  specifications?: Record<string, string>;
  isFeatured?: boolean;
  is_featured?: boolean;
  featured?: boolean;
  isBestseller?: boolean;
  is_bestseller?: boolean;
  bestseller?: boolean;
  created_at?: string;
}

/**
 * Get text value - handles brand/category as string or object
 */
const getTextValue = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    // Handle Laravel object format with 'name' property
    return (obj.name as string) || (obj.title as string) || String(obj) || '';
  }
  return '';
};

/**
 * Get array value with filtering
 */
const getArrayValue = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return (value as unknown[]).filter(v => v && typeof v === 'string') as string[];
  }
  if (typeof value === 'string') {
    return [value];
  }
  return [];
};

/**
 * Get URL with base path for relative URLs
 */
const getFullImageUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  const baseUrl = import.meta.env.VITE_API_URL;
  return `${baseUrl}/${path}`;
};

/**
 * Normalize product data from backend to frontend interface
 */
export const normalizeProductData = (data: RawProductData) => {
  // ===== PRICE NORMALIZATION =====
  let price = (data.price as number) || 0;
  if (!price || price === 0) {
    if (data.selling_price && Number(data.selling_price) > 0) {
      price = Number(data.selling_price) || 0;
    } else if (data.cost_price && Number(data.cost_price) > 0) {
      price = Number(data.cost_price) || 0;
    }
  }
  
  // Ensure price is a valid number, not NaN
  if (isNaN(price) || !isFinite(price)) {
    price = 0;
  }

  // ===== BRAND & CATEGORY NORMALIZATION =====
  const brand = getTextValue(data.brand);
  const category = getTextValue(data.category);

  // ===== IMAGE NORMALIZATION =====
  let thumbnail = (data.thumbnail as string) || (data.image as string) || '';
  if (thumbnail) {
    thumbnail = getFullImageUrl(thumbnail);
  }

  let images: string[] = [];
  if (Array.isArray(data.images)) {
    images = (data.images as string[]).map(getFullImageUrl).filter(url => url.length > 0);
  } else if (Array.isArray(data.gallery)) {
    images = (data.gallery as string[]).map(getFullImageUrl).filter(url => url.length > 0);
  }
  
  // Ensure at least thumbnail is in images
  if (images.length === 0 && thumbnail) {
    images = [thumbnail];
  }

  // ===== FEATURES NORMALIZATION =====
  const features = getArrayValue(data.features);

  // ===== COLORS NORMALIZATION =====
  const colors = getArrayValue(data.colors);

  // ===== OVERVIEW NORMALIZATION =====
  const overview = getArrayValue(data.overview);

  // ===== OPTIONS NORMALIZATION (product_options → options) =====
  let options: Record<string, string[]> = {};
  const optionsData = data.options || data.product_options;
  if (optionsData && typeof optionsData === 'object') {
    const opts = optionsData as Record<string, unknown>;
    Object.entries(opts).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        options[key] = (value as string[]).filter(v => v && typeof v === 'string');
      } else if (typeof value === 'string') {
        options[key] = [value];
      }
    });
  }


  // ===== AVAILABILITY NORMALIZATION =====
  let availability = data.availability as Record<string, unknown>;
  if (!availability && data.stock !== undefined) {
    const stock = data.stock as number;
    availability = {
      status: stock > 0 ? 'in_stock' : 'out_of_stock',
      label: stock > 0 ? 'Tersedia' : 'Habis',
      color: stock > 0 ? 'green' : 'red',
    };
  }

  interface AvailabilityObj {
    status: 'in_stock' | 'out_of_stock' | 'pre_order';
    label: string;
    color: string;
  }

  let availabilityObj: AvailabilityObj | undefined;
  if (availability) {
    const status = (availability.status as string) || 'in_stock';
    const validStatus = ['in_stock', 'out_of_stock', 'pre_order'].includes(status)
      ? (status as 'in_stock' | 'out_of_stock' | 'pre_order')
      : ('in_stock' as const);
    availabilityObj = {
      status: validStatus,
      label: (availability.label as string) || 'Available',
      color: (availability.color as string) || 'green',
    };
  }

  // ===== REVIEWS NORMALIZATION =====
  let reviews: Review[] = [];
  if (Array.isArray(data.reviews)) {
    reviews = (data.reviews as unknown[])
      .filter(r => r && typeof r === 'object')
      .map(r => {
        const review = r as Record<string, unknown>;
        return {
          name: (review.name as string) || 'Anonymous',
          rating: Math.max(0, Math.min(5, (review.rating as number) || 4.0)),
          date: (review.date as string) || new Date().toISOString().split('T')[0],
          comment: (review.comment as string) || '',
        } as Review;
      });
  }

  // ===== SPECS/SPECIFICATIONS NORMALIZATION =====
  let specs: Record<string, string> = {};
  const specsData = (data.specs as Record<string, unknown>) || (data.specifications as Record<string, unknown>);
  if (specsData && typeof specsData === 'object') {
    Object.entries(specsData).forEach(([key, value]) => {
      if (value && String(value).trim() !== '') {
        specs[key] = String(value);
      }
    });
  }

  return {
    id: (data.id as number | string) || 0,
    name: (data.name as string) || 'Untitled Product',
    price: price,
    category: category || 'Uncategorized',
    rating: (() => {
      let ratingValue = Number(data.rating) || 4.0;
      if (isNaN(ratingValue) || !isFinite(ratingValue)) {
        ratingValue = 4.0;
      }
      return Math.max(0, Math.min(5, ratingValue));
    })(),
    thumbnail: thumbnail,
    images: images.length > 0 ? images : (thumbnail ? [thumbnail] : []),
    isFeatured: (data.isFeatured as boolean) || (data.is_featured as boolean) || (data.featured as boolean) || false,
    isBestseller: (data.isBestseller as boolean) || (data.is_bestseller as boolean) || (data.bestseller as boolean) || false,
    brand: brand,
    description: (data.description as string) || '',
    features: features,
    overview: overview,
    colors: colors,
    reviews: reviews,
    specs: specs,
    options: options,
    availability: availabilityObj,
    stock: (data.stock as number) || 0,
    createdAt: (data.created_at as string) || (data.createdAt as string) || undefined,
    updatedAt: (data.updatedAt as string) || undefined,
  };
};

/**
 * Normalize multiple products
 */
export const normalizeProductsData = (productsData: RawProductData[]): ReturnType<typeof normalizeProductData>[] => {
  return Array.isArray(productsData) ? productsData.map(normalizeProductData) : [];
};
