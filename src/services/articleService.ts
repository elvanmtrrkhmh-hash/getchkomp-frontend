/**
 * API Service untuk Blog/Articles
 * Mengambil data artikel dari API backend Laravel
 */

import { resolveImageUrl } from '@/utils/imageUtils';
import type { Blog } from '@/data/products';

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api`;

/**
 * Normalisasi data artikel dari API ke format yang dibutuhkan frontend
 */
const normalizeArticle = (data: any): Blog => {
  return {
    id: data.id,
    title: data.title || 'Untitled',
    category: data.category?.name || data.category || 'General',
    tags: Array.isArray(data.tags) 
      ? data.tags.map((t: any) => typeof t === 'string' ? t : (t.name || String(t)))
      : [],
    author: data.author?.name || data.author || 'Admin',
    date: data.created_at 
      ? new Date(data.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
      : 'No date',
    thumbnail: resolveImageUrl(data.thumbnail || data.image),
    image: resolveImageUrl(data.image || data.thumbnail),
    excerpt: data.excerpt || (data.content ? data.content.substring(0, 160) + '...' : ''),
    content: data.content || '',
  };
};

export const articleService = {
  /**
   * Mengambil semua artikel dari API
   */
  getAllArticles: async () => {
    try {
      const response = await fetch(`${API_URL}/articles`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal mengambil data artikel');
      }

      // Nested structure parsing: Laravel Resource Collection with pagination
      // result.data.data -> array of articles
      // result.data -> fallback array
      // result -> fallback array
      const dataContainer = result.data || result;
      const articlesData = (dataContainer && dataContainer.data) ? dataContainer.data : (Array.isArray(dataContainer) ? dataContainer : []);
      
      const articles = Array.isArray(articlesData)
        ? articlesData.map(normalizeArticle)
        : [];

      return {
        success: true,
        data: articles,
      };
    } catch (error) {
      console.error('[articleService] Error fetch all articles:', error);
      let message = error instanceof Error ? error.message : 'Koneksi error';
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        message = 'Backend tidak aktif (http://localhost:8000). Jalankan Laravel: php artisan serve --port=8000';
      }
      return {
        success: false,
        error: message,
      };
    }
  },

  /**
   * Mengambil detail artikel tunggal berdasarkan ID
   */
  getArticleById: async (id: number | string) => {
    try {
      const response = await fetch(`${API_URL}/articles/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal mengambil detail artikel');
      }

      // Nested structure parsing: Single Laravel Resource
      // result.data -> article object
      // result -> article object
      const articleData = result.data || result;
      
      if (!articleData || typeof articleData !== 'object') {
        throw new Error('Data artikel tidak valid atau kosong');
      }

      const article = normalizeArticle(articleData);

      return {
        success: true,
        data: article,
      };
    } catch (error) {
      console.error(`[articleService] Error fetch article ${id}:`, error);
      let message = error instanceof Error ? error.message : 'Koneksi error';
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        message = 'Backend tidak aktif (http://localhost:8000). Jalankan Laravel: php artisan serve --port=8000';
      }
      return {
        success: false,
        error: message,
      };
    }
  },
};
