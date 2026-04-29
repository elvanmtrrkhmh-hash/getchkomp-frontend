import { useEffect, useState } from 'react';
import { catalogService } from '@/services/catalogService';
import type { Product } from '@/data/products';

interface FetchState {
  loading: boolean;
  error: string | null;
  data: Product[] | null;
}

export const useCatalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all products on mount
  const fetchProducts = async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await catalogService.getAllProducts(params);
      setProducts(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch product by ID
  const getProductDetail = async (id: number | string) => {
    try {
      const result = await catalogService.getProductDetail(id);
      return result.data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to fetch product detail');
    }
  };

  // Fetch products by category
  const getProductsByCategory = async (category: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await catalogService.getProductsByCategory(category);
      setProducts(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Search products
  const searchProducts = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await catalogService.searchProducts(query);
      setProducts(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    getProductDetail,
    getProductsByCategory,
    searchProducts,
  };
};
