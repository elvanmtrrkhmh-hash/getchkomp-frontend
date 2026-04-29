import React, { createContext, useContext, useState, useEffect } from "react";
import { type Product } from "@/data/products";
import { toast } from "sonner";

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string | number) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string | number) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("tech_hub_wishlist");
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Failed to parse wishlist from localStorage", e);
      }
    }
  }, []);

  // Sync with localStorage on change
  useEffect(() => {
    localStorage.setItem("tech_hub_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (productId: string | number) => {
    return wishlist.some((item) => String(item.id) === String(productId));
  };

  const addToWishlist = (product: Product) => {
    if (!isInWishlist(product.id)) {
      setWishlist((prev) => [...prev, product]);
      toast.success(`${product.name} ditambahkan ke favorit`);
    }
  };

  const removeFromWishlist = (productId: string | number) => {
    setWishlist((prev) => prev.filter((item) => String(item.id) !== String(productId)));
    toast.info("Produk dihapus dari favorit");
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
