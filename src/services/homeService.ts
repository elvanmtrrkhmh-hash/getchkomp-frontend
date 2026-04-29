/**
 * API Service for Home Page
 * Fetches and normalizes data for the homepage from /api/home
 */

import { resolveImageUrl } from '@/utils/imageUtils';
import type { Product, Blog } from '@/data/products';

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api`;

export interface HomeData {
  hero: {
    title: string;
    subtitle: string;
    image_url: string | null;
    cta_link: string;
  };
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  favorite_products: Product[];
  why_choose_us: {
    title: string;
    items: string[];
  };
  categories: Array<{
    id: number;
    name: string;
    image_url: string | null;
  }>;
  latest_articles: Blog[];
  testimonials: Array<{
    name: string;
    role: string;
    content: string;
  }>;
  footer_data: {
    about: string;
    contact: {
      email: string;
      phone: string;
    };
    social_links: Record<string, string>;
  };
}

/**
 * Helper to resolve storage URLs specifically for Laravel backend
 */
const resolveStorageUrl = (path: string | null | undefined): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  // Ensure the path prepends storage/ if it doesn't have it
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const storagePath = cleanPath.startsWith('storage/') ? cleanPath : `storage/${cleanPath}`;
  
  return `${BASE_URL}/${storagePath}`;
};

/**
 * Normalizes article data from Home API to Blog interface
 */
const normalizeHomeArticle = (data: any): Blog => {
  return {
    id: data.id,
    title: data.title || 'Untitled',
    category: data.category || 'General',
    tags: Array.isArray(data.tags) ? data.tags : [],
    author: data.author || 'Admin',
    date: data.published_at || 'No date',
    thumbnail: resolveStorageUrl(data.thumbnail),
    image: resolveStorageUrl(data.image || data.thumbnail),
    excerpt: data.excerpt || '',
    content: data.content || '',
  };
};

/**
 * Normalizes product data from Home API to Product interface
 */
const normalizeHomeProduct = (data: any): Product => {
  return {
    id: data.id || 0,
    name: data.name || 'Untitled Product',
    price: Number(data.price) || 0,
    category: data.category_name || data.category || 'Uncategorized', // Prefer category_name from Home API
    rating: Number(data.rating) || 4.5,
    thumbnail: resolveStorageUrl(data.thumbnail),
    images: data.images ? data.images.map(resolveStorageUrl) : [resolveStorageUrl(data.thumbnail)],
    isFeatured: true,
    isBestseller: !!data.is_bestseller,
    brand: data.brand || '',
    description: data.description || '',
    features: Array.isArray(data.features) ? data.features : [],
    overview: Array.isArray(data.overview) ? data.overview : [],
    colors: Array.isArray(data.colors) ? data.colors : [],
    reviews: [],
    specs: data.specs || {},
  };
};

export const homeService = {
  /**
   * Fetches all homepage data
   */
  getHomeData: async () => {
    try {
      const response = await fetch(`${API_URL}/home`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok || result.status !== 'success') {
        throw new Error(result.message || 'Failed to fetch homepage data');
      }

      const data = result.data;

      // Normalize the data
      const normalizedData: HomeData = {
        hero: {
          ...data.hero,
          image_url: resolveStorageUrl(data.hero.image_url)
        },
        features: data.features || [],
        favorite_products: (data.favorite_products || []).map(normalizeHomeProduct),
        why_choose_us: data.why_choose_us || { title: '', items: [] },
        categories: data.categories || [],
        latest_articles: (data.latest_articles || []).map(normalizeHomeArticle),
        testimonials: data.testimonials || [],
        footer_data: data.footer_data || {},
      };

      return {
        success: true,
        data: normalizedData,
      };
    } catch (error) {
      console.error('[homeService] Error fetch home data:', error);
      let message = error instanceof Error ? error.message : 'Koneksi error';
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        message = 'Backend tidak aktif (http://localhost:8000). Jalankan Laravel dengan: php artisan serve --port=8000';
      }
      return {
        success: false,
        error: message,
      };
    }
  },
};
