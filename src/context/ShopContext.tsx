import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from "react";
import { products as mockProducts, categories, type Product } from "@/data/products";
import { catalogService } from "@/services/catalogService";

// ==========================================
//  SHOP CONTEXT — State Management for the Shop Flow
//  Fetch products from API with pagination and query parameters
//  Fallback to mock data only when API fails
// ==========================================

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

interface ShopContextType {
  // Products & Pagination
  products: Product[];
  allProducts: Product[];  // All products for filtering
  categories: string[];
  filteredProducts: Product[];
  pagination: PaginationInfo;
  
  // Filtering & Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  
  // Pagination & API
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  loadMore: () => Promise<void>;
  
  // Loading & Error
  loading: boolean;
  error: string | null;
  usingMockData: boolean;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Product state
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 12,
    lastPage: 1,
  });
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("default");
  const loadingRef = React.useRef(false);

  // Fetch products from API with query parameters
  const fetchProducts = useCallback(async (page: number = 1, limit: number = 12) => {
    // Prevent concurrent fetches or infinite loops
    if (loadingRef.current && page === 1) return;

    try {
      loadingRef.current = true;
      setLoading(true);
      setError(null);
      
      // Prepare query parameters
      const params: Parameters<typeof catalogService.getAllProducts>[0] = {
        page,
        limit,
        ...(selectedCategory && { category: selectedCategory }),
        ...(searchQuery && { search: searchQuery }),
        ...(sortBy !== "default" && { sort: sortBy }),
      };
      
      console.log('[ShopContext] Fetching products with params:', params);
      const result = await catalogService.getAllProducts(params);
      
      // If API returns success, use API data and disable mock data
      if (result.success) {
        console.log('[ShopContext] API success:', {
          dataCount: result.data?.length || 0,
          total: result.total,
          page: result.page,
        });
        
        const productsData = (result.data as Product[]) || [];
        setProducts(productsData);
        setAllProducts(productsData);
        
        setPagination({
          total: result.total || productsData.length,
          page: result.page || 1,
          limit: result.limit || 12,
          lastPage: Math.ceil((result.total || productsData.length) / (result.limit || 12)) || 1,
        });
        
        setUsingMockData(false);
        setError(null);
      } else {
        throw new Error(result.message || 'API responded with failure status');
      }
    } catch (err) {
      console.error('[ShopContext] API Error:', err);
      
      // Only fallback to mock data if we don't have existing products
      if (allProducts.length === 0) {
        console.warn('[ShopContext] Falling back to mock data');
        setProducts(mockProducts);
        setAllProducts(mockProducts);
        setPagination({
          total: mockProducts.length,
          page: 1,
          limit: 12,
          lastPage: Math.ceil(mockProducts.length / 12),
        });
        setUsingMockData(true);
        setError("Backend tidak aktif. Menampilkan data offline.");
      } else {
        setError("Gagal memperbarui data. Silakan coba beberapa saat lagi.");
      }
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, sortBy, mockProducts]); // Removed allProducts.length and usingMockData

  // Fetch when mount or filters change
  useEffect(() => {
    setCurrentPage(1);
    fetchProducts(1, pageSize);
  }, [selectedCategory, searchQuery, sortBy, pageSize, fetchProducts]);

  // Load more function for pagination
  const loadMore = useCallback(async () => {
    const nextPage = currentPage + 1;
    if (nextPage <= pagination.lastPage && !loading) {
      await fetchProducts(nextPage, pageSize);
      setCurrentPage(nextPage);
    }
  }, [currentPage, pagination.lastPage, pageSize, fetchProducts, loading]);

  // Client-side filtering on already-fetched products (for UI responsiveness)
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Additional client-side price filtering (API may handle this too)
    const [minPrice, maxPrice] = priceRange;
    result = result.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    // Note: search, category, sort are handled by API parameters
    // This is for additional UI-level filtering if needed

    return result;
  }, [allProducts, priceRange]);

  const value: ShopContextType = {
    products,
    allProducts,
    categories,
    filteredProducts,
    pagination,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    selectedBrands,
    setSelectedBrands,
    sortBy,
    setSortBy,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    loadMore,
    loading,
    error,
    usingMockData,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = (): ShopContextType => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};

export default ShopContext;
