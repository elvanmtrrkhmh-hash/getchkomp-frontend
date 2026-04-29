/**
 * API Service untuk Catalog/Product
 * Mengambil data produk dari API
 */

import { normalizeProductData, normalizeProductsData } from '@/utils/productNormalizer';
import type { Review } from '@/data/products';

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

// Helper function untuk extract error message dari API response
const getErrorMessage = (result: Record<string, unknown>): string => {
  let errorMessage = (result.message as string) || 'Request failed';
  
  if (result.errors && typeof result.errors === 'object') {
    const fieldErrors = Object.entries(result.errors as Record<string, unknown>)
      .map(([field, messages]: [string, unknown]) => {
        if (Array.isArray(messages)) {
          return messages.join(', ');
        }
        return String(messages);
      })
      .filter(msg => msg.length > 0);
    
    if (fieldErrors.length > 0) {
      errorMessage = fieldErrors.join(' | ');
    }
  }
  
  return errorMessage;
};

// Normalize API response to match Product interface - menggunakan productNormalizer helper
const normalizeProduct = (data: Record<string, unknown>) => {
  return normalizeProductData(data as Parameters<typeof normalizeProductData>[0]);
};

export const catalogService = {
  /**
   * Get All Products
   */
  getAllProducts: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort?: string;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', String(params.page));
      if (params?.limit) queryParams.append('limit', String(params.limit));
      if (params?.category) queryParams.append('category', params.category);
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sort) queryParams.append('sort', params.sort);

      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await fetch(`${API_URL}/catalog${queryString}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok || !result.status || result.status !== 'success') {
        const errorMessage = getErrorMessage(result);
        throw new Error(errorMessage);
      }

      // Extract products from result.products (handles both array and paginated object)
      const productsSource = result.products?.data || result.products || result.data || [];
      const products = Array.isArray(productsSource)
        ? productsSource.map((p) => {
            try {
              return normalizeProduct(p);
            } catch (normErr) {
              console.error('Error normalizing product:', p, normErr);
              return null;
            }
          }).filter(p => p !== null)
        : [];

      // Extract pagination info from products.meta or root meta
      const meta = result.products?.meta || result.meta || {};

      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[catalogService] getAllProducts response:', {
          statusSuccess: response.ok,
          resultStatus: result.status,
          productsCount: products.length,
          totalFromMeta: meta.total,
          hasProducts: products.length > 0,
        });
      }

      return {
        success: true,
        data: products,
        total: meta.total || products.length,
        page: meta.current_page || 1,
        limit: meta.per_page || 12,
        message: result.message || 'Products fetched successfully',
      };
    } catch (error) {
      console.error('Get all products error:', error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Backend tidak aktif atau tidak dapat dijangkau. Pastikan server Laravel sudah dijalankan (php artisan serve --port=8000).');
      }
      throw error;
    }
  },

  /**
   * Get Single Product Detail
   */
  getProductDetail: async (productId: number | string) => {
    try {
      // Validate productId
      if (!productId) {
        throw new Error('Product ID is required');
      }

      const url = `${API_URL}/catalog/${productId}`;
      
      console.log(`[catalogService.getProductDetail] Attempting to fetch from: ${url}`);

      // Fetch product detail
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log(`[catalogService.getProductDetail] Endpoint status: ${response.status}`);

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = getErrorMessage(result);
        console.error(`[catalogService.getProductDetail] Request failed with status ${response.status}: ${errorMessage}`);
        throw new Error(`Failed to fetch product (${response.status}): ${errorMessage}`);
      }

      // Check if response is success
      if (result.error) {
        const errorMessage = getErrorMessage(result);
        console.error(`[catalogService.getProductDetail] API error: ${errorMessage}`);
        throw new Error(errorMessage);
      }

      // Normalize product data - backend returns product directly (key is "product" not "data")
      const productData = result.product || result.data || result;
      if (!productData) {
        throw new Error('No product data in response');
      }

      const normalizedProduct = normalizeProduct(productData);

      console.log(`[catalogService.getProductDetail] Successfully fetched product:`, {
        id: normalizedProduct.id,
        name: normalizedProduct.name,
        price: normalizedProduct.price,
        brand: normalizedProduct.brand,
        category: normalizedProduct.category,
        hasDescription: !!normalizedProduct.description,
        hasFeatures: (normalizedProduct.features?.length || 0) > 0,
        hasOverview: (normalizedProduct.overview?.length || 0) > 0,
        hasImages: (normalizedProduct.images?.length || 0) > 0,
        hasColors: (normalizedProduct.colors?.length || 0) > 0,
        availability: normalizedProduct.availability?.status,
      });

      return {
        success: true,
        data: normalizedProduct,
        message: result.message || 'Product fetched successfully',
      };
    } catch (error) {
      console.error('[catalogService.getProductDetail] Error:', error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Backend tidak aktif atau tidak dapat dijangkau. Pastikan server Laravel sudah dijalankan (php artisan serve --port=8000).');
      }
      throw error;
    }
  },

  /**
   * Get Products by Category
   */
  getProductsByCategory: async (category: string) => {
    try {
      const response = await fetch(`${API_URL}/catalog?category=${encodeURIComponent(category)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok || !result.status || result.status !== 'success') {
        const errorMessage = getErrorMessage(result);
        throw new Error(errorMessage);
      }

      // Extract products from result.products (handles both array and paginated object)
      const productsSource = result.products?.data || result.products || result.data || [];
      const products = Array.isArray(productsSource)
        ? productsSource.map(normalizeProduct)
        : [];

      // Extract pagination info from products.meta or root meta
      const meta = result.products?.meta || result.meta || {};

      return {
        success: true,
        data: products,
        total: meta.total || products.length,
        page: meta.current_page || 1,
        limit: meta.per_page || 12,
        message: result.message || 'Products fetched successfully',
      };
    } catch (error) {
      console.error('Get products by category error:', error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Backend tidak aktif atau tidak dapat dijangkau. Pastikan server Laravel sudah dijalankan (php artisan serve --port=8000).');
      }
      throw error;
    }
  },

  /**
   * Search Products
   */
  searchProducts: async (query: string, params?: {
    page?: number;
    limit?: number;
    category?: string;
  }) => {
    return catalogService.getAllProducts({
      search: query,
      ...params,
    });
  },
};
