import type { Product } from "@/data/products";

/**
 * Get the display price for a product
 * If main price is 0, fallback to first variant price
 */
export const getDisplayPrice = (product: Product): number => {
  return product.price || 0;
};

/**
 * Get price range from products
 */
export const getPriceRange = (products: Product[]): [number, number] => {
  if (products.length === 0) return [0, 0];
  
  const prices = products.map(p => getDisplayPrice(p)).filter(p => p > 0);
  if (prices.length === 0) return [0, 1000000];
  
  const minPrice = Math.floor(Math.min(...prices) / 100000) * 100000;
  const maxPrice = Math.ceil(Math.max(...prices) / 100000) * 100000;
  
  return [minPrice, maxPrice];
};
