import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from "react";
import { blogs as mockBlogs, type Blog } from "@/data/products";
import { articleService } from "@/services/articleService";

// ==========================================
//  BLOG CONTEXT — State Management for the Blog Flow
//  Fetch articles from API with fallback to mock data
// ==========================================

interface BlogContextType {
  blogPosts: Blog[];
  filteredBlogs: Blog[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  allCategories: string[];
  allTags: string[];
  
  // API States
  loading: boolean;
  error: string | null;
  usingMockData: boolean;
  refreshBlogs: () => Promise<void>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

// Developer Toggle - Set to true to enable mock data when API fails
const ENABLE_MOCK_FALLBACK = false;

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blogPosts, setBlogPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Function to fetch articles from API
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await articleService.getAllArticles();
      
      if (result.success && result.data) {
        setBlogPosts(result.data);
        setUsingMockData(false);
        
        if (result.data.length === 0) {
          setError("Belum ada artikel yang dipublikasikan.");
        }
      } else {
        throw new Error(result.error || "Gagal mendapatkan data dari API");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Gagal memuat artikel dari API";
      console.error("[BlogContext] API error:", errorMessage);
      
      if (ENABLE_MOCK_FALLBACK) {
        console.warn("[BlogContext] Falling back to mock data (ENABLE_MOCK_FALLBACK=true)");
        setBlogPosts(mockBlogs);
        setUsingMockData(true);
      } else {
        setBlogPosts([]);
        setUsingMockData(false);
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Derive unique categories and tags from current blogPosts
  const allCategories = useMemo(
    () => Array.from(new Set(blogPosts.map((b) => b.category))).sort(),
    [blogPosts]
  );

  const allTags = useMemo(
    () => Array.from(new Set(blogPosts.flatMap((b) => b.tags))).sort(),
    [blogPosts]
  );

  // Implement blog filtering logic
  const filteredBlogs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return blogPosts.filter((blog) => {
      // 1) Search by title (case-insensitive)
      const matchSearch = q ? blog.title.toLowerCase().includes(q) : true;

      // 2) Filter by category
      const matchCategory = selectedCategory ? blog.category === selectedCategory : true;

      // 3) Filter by tag
      const matchTag = selectedTag ? blog.tags.includes(selectedTag) : true;

      return matchSearch && matchCategory && matchTag;
    });
  }, [blogPosts, searchQuery, selectedCategory, selectedTag]);

  const value: BlogContextType = {
    blogPosts,
    filteredBlogs,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedTag,
    setSelectedTag,
    allCategories,
    allTags,
    loading,
    error,
    usingMockData,
    refreshBlogs: fetchBlogs
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};

export const useBlog = (): BlogContextType => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
};

export default BlogContext;
