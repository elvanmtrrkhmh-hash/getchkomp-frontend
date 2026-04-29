import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, ChevronDown, X, ChevronLeft, ChevronRight, PackageSearch, AlertCircle, ShoppingCart, Heart } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/data/products";
import { getDisplayPrice } from "@/utils/productUtils";
import { resolveImageUrl, getSafeSrc, getPlaceholderImage } from "@/utils/imageUtils";
import { StarRating } from "@/components/StarRating";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useTranslation, Trans } from "react-i18next";

const Products = () => {
  const {
    products,
    filteredProducts,
    categories,
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
    loading,
    error,
    usingMockData,
    pagination,
    currentPage,
    setCurrentPage,
    pageSize,
  } = useShop();

  const { 
    wishlist, 
    toggleWishlist, 
    isInWishlist 
  } = useWishlist();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Extract unique brands from all products
  const brands = Array.from(new Set(products.map(p => p.brand))).filter(b => b && b.length > 0);

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(
      selectedBrands.includes(brand)
        ? selectedBrands.filter((b) => b !== brand)
        : [...selectedBrands, brand]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setPriceRange([0, 50000000]);
    setSelectedBrands([]);
    setSortBy("default");
    setCurrentPage(1);
  };

  const hasActiveFilters = 
    searchQuery || 
    selectedCategory || 
    selectedBrands.length > 0 || 
    priceRange[0] !== 0 || 
    priceRange[1] !== 50000000;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">{t("products.title")}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <p className="text-muted-foreground text-sm">
                <Trans 
                  i18nKey="products.showing_count" 
                  values={{ count: filteredProducts.length, total: pagination.total }} 
                  components={{ span: <span className="font-semibold text-primary" /> }}
                />
              </p>
              {error && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {error}
                </div>
              )}
              {usingMockData && !error && (
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium uppercase tracking-wider">{t("products.offline_mode")}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              {t("products.filters")}
            </Button>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-card">
                <SelectValue placeholder={t("products.sort_by")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">{t("products.sort_default")}</SelectItem>
                <SelectItem value="price-asc">{t("products.sort_price_asc")}</SelectItem>
                <SelectItem value="price-desc">{t("products.sort_price_desc")}</SelectItem>
                <SelectItem value="rating">{t("products.sort_rating")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside
            className={`
              fixed inset-y-0 left-0 z-40 w-72 bg-card border-r border-border p-6 overflow-y-auto
              transform transition-transform duration-300 lg:transform-none
              lg:static lg:w-1/4 lg:min-w-[260px] lg:rounded-lg lg:border lg:shadow-sm
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-lg text-foreground">{t("products.filters")}</h2>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-muted-foreground">
                    {t("products.clear_all")}
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="mb-6">
              <label className="text-sm font-medium text-foreground mb-2 block">{t("common.search")}</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("products.search_placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background"
                />
              </div>
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="text-sm font-medium text-foreground mb-3 block">{t("products.categories")}</label>
              <RadioGroup
                value={selectedCategory || ""}
                onValueChange={(val) => setSelectedCategory(val || null)}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="" id="cat-all" />
                  <label htmlFor="cat-all" className="text-sm text-foreground cursor-pointer">{t("products.all_categories")}</label>
                </div>
                {categories.map((cat) => (
                  <div key={cat} className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value={cat} id={`cat-${cat}`} />
                    <label htmlFor={`cat-${cat}`} className="text-sm text-foreground cursor-pointer">{cat}</label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="text-sm font-medium text-foreground mb-3 block">{t("products.price_range")}</label>
              <Slider
                min={0}
                max={50000000}
                step={5000}
                value={priceRange}
                onValueChange={(val) => setPriceRange(val as [number, number])}
                className="mb-3"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>

            {/* Brands */}
            <div className="mb-6">
              <label className="text-sm font-medium text-foreground mb-3 block">{t("products.brands")}</label>
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={() => handleBrandToggle(brand)}
                  />
                  <label htmlFor={`brand-${brand}`} className="text-sm text-foreground cursor-pointer">{brand}</label>
                </div>
              ))}
            </div>
          </aside>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Product Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden bg-card border-border">
                    <div className="aspect-video bg-muted-foreground/10 animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-muted-foreground/10 rounded animate-pulse" />
                      <div className="h-6 bg-muted-foreground/10 rounded animate-pulse" />
                      <div className="flex justify-between">
                        <div className="h-4 w-12 bg-muted-foreground/10 rounded animate-pulse" />
                        <div className="h-4 w-12 bg-muted-foreground/10 rounded animate-pulse" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-24 bg-card rounded-2xl border-2 border-dashed border-muted/50 shadow-sm">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <PackageSearch className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-3">{t("products.no_products")}</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mb-8 text-sm leading-relaxed">
                  {t("products.no_products_desc")}
                </p>
                {hasActiveFilters && (
                  <Button variant="default" onClick={clearFilters} className="rounded-full px-10 shadow-md hover:shadow-lg transition-all">
                    {t("products.clear_filters")}
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden card-hover bg-card border-border transition-all hover:shadow-lg flex flex-col h-full">
                      <div className="aspect-square relative overflow-hidden bg-muted">
                        <img 
                          src={getSafeSrc(resolveImageUrl(product.thumbnail) || resolveImageUrl(product.images?.[0]))} 
                          alt={product.name} 
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getPlaceholderImage();
                          }}
                        />
                        {product.isBestseller && (
                          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider z-10">
                            Bestseller
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(product);
                          }}
                          className={`absolute top-3 right-3 p-2.5 rounded-full shadow-md backdrop-blur-md transition-all duration-300 z-10 ${
                            isInWishlist(product.id)
                              ? "bg-red-500 text-white scale-110"
                              : "bg-white/80 text-slate-400 hover:text-red-500 hover:scale-110"
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                        </button>
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2 font-medium">{product.category}</p>
                        <h3 className="font-display font-semibold text-foreground text-sm leading-tight mb-3 line-clamp-2 flex-grow">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                          <StarRating rating={product.rating} size={14} showText={false} />
                          <span className="text-xs font-medium text-muted-foreground">{Number(product.rating).toFixed(1)} / 5.0</span>
                        </div>
                        <p className="text-primary font-bold text-lg mb-3">{formatPrice(getDisplayPrice(product))}</p>
                        <div className="space-y-2 mt-auto">
                          <div className="flex items-center justify-between mb-2">
                            <span 
                              className={`text-xs font-semibold px-2 py-1 rounded-md ${
                                product.availability?.status === 'in_stock' 
                                  ? 'bg-green-100 text-green-700' 
                                  : product.availability?.status === 'pre_order'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {product.availability?.status === 'in_stock' && '✓ '}{product.availability?.label || t("products.available")}
                            </span>
                          </div>
                          <div className="space-y-2 mt-auto">
                            <Button
                              size="sm"
                              className="w-full gap-2 text-xs"
                              onClick={() => {
                                navigate(`/product/${product.id}`);
                              }}
                            >
                              <ShoppingCart className="h-4 w-4" /> {t("featured.add_to_cart")}
                            </Button>
                            <Button asChild size="sm" variant="outline" className="w-full text-xs">
                              <Link to={`/product/${product.id}`}>{t("featured.view_details")}</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Pagination Controls */}
                {pagination.lastPage > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    {Array.from({ length: pagination.lastPage }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="min-w-[40px]"
                      >
                        {page}
                      </Button>
                    ))}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === pagination.lastPage}
                      onClick={() => setCurrentPage(Math.min(pagination.lastPage, currentPage + 1))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Products;
;
