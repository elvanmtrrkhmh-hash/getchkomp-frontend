import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Check, ChevronRight, Minus, Plus, ShoppingCart, Truck, Shield, RotateCcw, Heart } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/data/products";
import { getDisplayPrice } from "@/utils/productUtils";
import { resolveImageUrl, resolveImageUrls, getSafeSrc, getPlaceholderImage } from "@/utils/imageUtils";
import { catalogService } from "@/services/catalogService";
import { useCatalog } from "@/hooks/useCatalog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useCart } from "react-use-cart";
import type { Product } from "@/data/products";
import { useTranslation } from "react-i18next";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useShop();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { t } = useTranslation();
  
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [qty, setQty] = useState(1);
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const chooseOption = (key: string, val: string) => {
    setSelectedOptions((prev) => {
      if (prev[key] === val) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      }
      return { ...prev, [key]: val };
    });
  };

  // Fetch product from API
  useEffect(() => {
    if (!id) {
      setError('No product ID provided');
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await catalogService.getProductDetail(id);
        
        if (result.success && result.data) {
          const loadedProduct: Product = result.data;
          setProduct(loadedProduct);
        } else {
          throw new Error('Invalid response from API');
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch product';
        const fallbackProduct = products.find((p) => String(p.id) === id);
        
        if (fallbackProduct) {
          setProduct(fallbackProduct);
          setError(null);
        } else {
          setError(`Product not found: ${errorMsg}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, products]);

  // Reset selected options when product changes
  useEffect(() => {
    if (!product) return;
    setSelectedColor("");
    setSelectedThumb(0);
    setSelectedOptions({});
    setQty(1);
  }, [product])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 text-center">
          <div className="space-y-4">
            <div className="h-8 bg-muted-foreground/10 rounded animate-pulse w-1/2 mx-auto" />
            <div className="h-4 bg-muted-foreground/10 rounded animate-pulse w-2/3 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (!product || error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 text-center">
          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-lg mb-6 max-w-2xl mx-auto">
              <p className="text-sm font-medium">❌ {t("common.error")} loading product:</p>
              <p className="text-sm mt-2">{error}</p>
              <div className="mt-3 pt-3 border-t border-destructive/30 text-left text-xs">
                <p className="font-medium mb-1">Debug Info:</p>
                <p>Product ID: <code className="bg-destructive/20 px-2 py-1 rounded">{id || 'None'}</code></p>
                <p className="mt-1">Check browser console for detailed logs</p>
              </div>
            </div>
          )}
          <h1 className="text-2xl font-display font-bold text-foreground mb-4">{t("products.no_products")}</h1>
          <p className="text-muted-foreground mb-6">{t("products.no_products_desc")}</p>
          <div className="space-y-2">
            <Button asChild variant="outline">
              <Link to="/products">← {t("featured.view_details")}</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const resolvedImages = resolveImageUrls(product.images, product.thumbnail);
  const thumbnails = resolvedImages.length > 0 ? resolvedImages : [getPlaceholderImage()];
  const safeIndex = Math.max(0, Math.min(selectedThumb, thumbnails.length - 1));

  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">{t("navbar.home")}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/products" className="hover:text-primary transition-colors">{t("navbar.products")}</Link>
          {product.category && (
            <>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link to={`/products?category=${product.category}`} className="hover:text-primary transition-colors">
                {product.category}
              </Link>
            </>
          )}
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Main Section: Gallery + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Left — Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-muted flex items-center justify-center border border-border">
              <img 
                src={getSafeSrc(thumbnails[safeIndex])}
                alt={product.name}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getPlaceholderImage();
                }}
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(product);
                }}
                className={`absolute top-4 right-4 p-3 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 z-10 ${
                  isInWishlist(product.id)
                    ? "bg-red-500 text-white scale-110"
                    : "bg-white/80 text-slate-400 hover:text-red-500 hover:scale-110"
                }`}
              >
                <Heart className={`h-6 w-6 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
              </button>
            </div>
            {thumbnails.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {thumbnails.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedThumb(i)}
                  type="button"
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedThumb === i ? "border-primary shadow-md" : "border-border hover:border-primary"
                  }`}
                >
                  <img 
                    src={getSafeSrc(src)}
                    alt={`${product.name} thumbnail ${i + 1}`} 
                    className="h-full w-full object-cover" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getPlaceholderImage();
                    }}
                  />
                </button>
              ))}
            </div>
            )}
          </div>

          {/* Right — Info */}
          <div>
            {/* Category & Badges */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {product.category && (
                <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                  {product.category}
                </span>
              )}
              
              {product.isFeatured && (
                <span className="px-3 py-1 bg-amber-500/10 text-amber-700 text-xs font-semibold rounded-full border border-amber-200/50">
                  ⭐ {t("common.featured", "Featured")}
                </span>
              )}
              
              {product.isBestseller && (
                <span className="px-3 py-1 bg-red-500/10 text-red-700 text-xs font-semibold rounded-full border border-red-200/50">
                  🔥 Bestseller
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">{product.name}</h1>

            {product.brand && (
              <p className="text-sm text-muted-foreground mb-4">
                {t("products.brands")}: <span className="font-semibold text-foreground">{product.brand}</span>
              </p>
            )}

            <div className="flex items-center gap-3 mb-6">
              <StarRating rating={product.rating || 4.0} size={18} showText />
            </div>

            <p className="text-3xl font-bold text-primary mb-6">{formatPrice(getDisplayPrice(product))}</p>

            {/* Availability Status */}
            <div className="mb-6 p-3 rounded-lg border" style={{ 
              borderColor: product.availability?.color === 'red' ? '#ef4444' : product.availability?.color === 'blue' ? '#3b82f6' : '#10b981',
              backgroundColor: product.availability?.color === 'red' ? '#fef2f2' : product.availability?.color === 'blue' ? '#eff6ff' : '#ecfdf5'
            }}>
              <p className="text-sm font-medium" style={{
                color: product.availability?.color === 'red' ? '#b91c1c' : product.availability?.color === 'blue' ? '#1e40af' : '#047857'
              }}>
                {product.availability?.status === 'in_stock' && '✓ '}
                {product.availability?.label || t("products.available")}
              </p>
            </div>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              {product.description || t("detail.no_description")}
            </p>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-8">
                <h3 className="font-display font-semibold text-foreground mb-3">{t("detail.features")}</h3>
                <ul className="space-y-2">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}


            {/* Product Options & Colors */}
            <div className="space-y-4 mb-8">
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    {t("cart.color")}
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {product.colors.map((c) => (
                      <Button
                        key={c}
                        size="sm"
                        type="button"
                        variant={selectedColor === c ? "default" : "outline"}
                        onClick={() => setSelectedColor(prev => (prev === c ? "" : c))}
                      >
                        {c}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {product.options && Object.keys(product.options).length > 0 && (
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="text-sm font-semibold text-foreground">{t("detail.specifications")}</h4>
                  {Object.entries(product.options).map(([key, values]) => (
                    <div key={key}>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wide">{key}</label>
                      <div className="flex gap-2 flex-wrap">
                        {values && Array.isArray(values) && values.map((v) => (
                          <Button
                            key={v}
                            size="sm"
                            variant={selectedOptions[key] === v ? "default" : "outline"}
                            onClick={() => chooseOption(key, v)}
                            className="text-xs"
                          >
                            {v}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-border rounded-lg bg-muted/50 p-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="h-8 w-8 rounded"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold text-foreground">{qty}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setQty(qty + 1)}
                    className="h-8 w-8 rounded"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Validation Logic */}
                {(() => {
                  const hasColors = product.colors && product.colors.length > 0;
                  const hasOptions = product.options && Object.keys(product.options).length > 0;
                  
                  const isColorSelected = !hasColors || !!selectedColor;
                  const areOptionsSelected = !hasOptions || (
                    Object.keys(product.options || {}).every(key => !!selectedOptions[key])
                  );
                  
                  const isAllOptionsSelected = isColorSelected && areOptionsSelected;

                  return (
                    <Button
                      className="flex-1 gap-2"
                      size="lg"
                      disabled={!isAllOptionsSelected}
                      onClick={() => {
                        const itemPrice = getDisplayPrice(product);
                        
                        if (itemPrice <= 0) {
                          toast.error(t("detail.invalid_price"));
                          return;
                        }

                        const optionsString = Object.entries(selectedOptions)
                          .sort(([a], [b]) => a.localeCompare(b))
                          .map(([key, val]) => `${key}:${val}`)
                          .join('|');
                        
                        const uniqueId = `${product.id}${selectedColor ? `-${selectedColor}` : ''}${optionsString ? `-${optionsString}` : ''}`;
                        
                        addItem(
                          {
                            id: uniqueId,
                            productId: product.id,
                            name: product.name,
                            price: itemPrice,
                            image: product.thumbnail,
                            color: selectedColor,
                            selectedOptions: { ...selectedOptions },
                          },
                          qty
                        );

                        toast.success(`${product.name} ${t("detail.added_to_cart")}`, {
                          description: t("detail.stay_and_shop"),
                          action: {
                            label: t("detail.view_cart"),
                            onClick: () => navigate("/cart")
                          }
                        });
                      }}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      {t("detail.add_to_cart")}
                    </Button>
                  );
                })()}
              </div>

              {/* Validation Message */}
              {(() => {
                const hasColors = product.colors && product.colors.length > 0;
                const hasOptions = product.options && Object.keys(product.options).length > 0;
                const isColorSelected = !hasColors || !!selectedColor;
                const areOptionsSelected = !hasOptions || (
                  Object.keys(product.options || {}).every(key => !!selectedOptions[key])
                );
                const isAllOptionsSelected = isColorSelected && areOptionsSelected;

                if (!isAllOptionsSelected) {
                  return (
                    <p className="text-sm font-medium text-destructive animate-pulse">
                      ⚠️ {t("detail.complete_options_first")}
                    </p>
                  );
                }
                return null;
              })()}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              {[
                { icon: Truck, label: t("detail.free_shipping") },
                { icon: Shield, label: t("detail.warranty") },
                { icon: RotateCcw, label: t("detail.returns") },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center text-center p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <Icon className="h-6 w-6 text-primary mb-2" />
                  <span className="text-xs font-medium text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="mb-16">
          <TabsList className="w-full justify-start bg-muted">
            <TabsTrigger value="overview">{t("detail.description")}</TabsTrigger>
            <TabsTrigger value="specs">{t("detail.specifications")}</TabsTrigger>
            <TabsTrigger value="reviews">{t("detail.reviews")}</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-6">
            <div className="space-y-3 text-muted-foreground">
              {product.overview && product.overview.length > 0 ? (
                product.overview.map((item, i) => (
                  <p key={i}>{item}</p>
                ))
              ) : (
                <p className="text-foreground">{product.description || t("detail.no_description")}</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="specs" className="mt-6">
            <div className="space-y-3">
              {product.specs && Object.keys(product.specs).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(product.specs)
                    .filter(([_, value]) => value && String(value).trim() !== '')
                    .map(([key, value]) => {
                      const formattedKey = key
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/_/g, ' ')
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ')
                        .trim();

                      return (
                        <div
                          key={key}
                          className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-3 border-b last:border-b-0"
                        >
                          <span className="text-sm font-semibold text-foreground">
                            {formattedKey}
                          </span>
                          <span className="col-span-1 md:col-span-2 text-sm text-muted-foreground">
                            {String(value)}
                          </span>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4">{t("detail.specifications")} not available</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-5">
              {!product.reviews || product.reviews.length === 0 ? (
                <p className="text-muted-foreground">{t("detail.no_reviews")}</p>
              ) : (
                product.reviews.map((review, i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{review.name || 'Anonymous'}</p>
                        <p className="text-xs text-muted-foreground">{review.date || 'No date'}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <StarRating rating={review.rating || 4.0} size={14} showText={true} textSize="text-sm" />
                      </div>
                    </div>

                    <p className="text-sm">{review.comment || 'No comment'}</p>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section>
            <h2 className="text-xl font-display font-bold text-foreground mb-6">{t("detail.related_products")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((rp) => {
                const rpPrimaryImage = resolveImageUrl(rp.images?.[0]) || resolveImageUrl(rp.thumbnail) || getPlaceholderImage();
                return (
                  <Card key={rp.id} className="overflow-hidden card-hover bg-card border-border">
                    <div className="aspect-video overflow-hidden bg-muted">
                      <img 
                        src={getSafeSrc(rpPrimaryImage)} 
                        alt={rp.name} 
                        className="h-full w-full object-cover" 
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getPlaceholderImage();
                        }}
                      />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-xs text-muted-foreground">{rp.category || 'Product'}</p>
                        {rp.isBestseller && (
                          <span className="px-2 py-0.5 bg-red-500/10 text-red-700 text-xs font-semibold rounded border border-red-200/50">
                            🔥 Bestseller
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-semibold text-foreground text-sm leading-tight mb-1 line-clamp-1">{rp.name}</h3>
                      {rp.brand && (
                        <p className="text-xs text-muted-foreground mb-1">{rp.brand}</p>
                      )}
                      <p className="text-primary font-bold text-sm">{formatPrice(getDisplayPrice(rp))}</p>
                      <div className="space-y-2 mt-auto">
                        <Button
                          size="sm"
                          className="w-full gap-2 text-xs"
                          onClick={() => {
                            navigate(`/product/${rp.id}`);
                          }}
                        >
                          <ShoppingCart className="h-4 w-4" /> {t("featured.add_to_cart")}
                        </Button>
                        <Button asChild size="sm" variant="outline" className="w-full text-xs">
                          <Link to={`/product/${rp.id}`}>{t("featured.view_details")}</Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
