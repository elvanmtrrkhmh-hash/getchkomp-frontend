import { ShoppingCart, Star, Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice, type Product } from "@/data/products";
import { resolveImageUrl, getSafeSrc, getPlaceholderImage } from "@/utils/imageUtils";
import { StarRating } from "@/components/StarRating";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface FeaturedProductsProps {
  products: Product[];
}

const FeaturedProducts = ({ products }: FeaturedProductsProps) => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { t } = useTranslation();

  if (!products || products.length === 0) return null;

  return (
    <section id="products" className="py-20 bg-muted/30">
      <div className="container">
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">{t("featured.badge")}</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{t("featured.title")}</h2>
          <p className="mt-2 text-muted-foreground">{t("featured.description")}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <Card
              key={p.id}
              className="overflow-hidden card-hover bg-card border-border transition-all hover:shadow-lg flex flex-col h-full"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img 
                  src={getSafeSrc(resolveImageUrl(p.thumbnail) || resolveImageUrl(p.images?.[0]))} 
                  alt={p.name} 
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" 
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getPlaceholderImage();
                  }}
                />
                <div className="absolute inset-0 flex items-end p-3">
                  <span className="rounded-lg bg-background/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-foreground backdrop-blur">
                    {p.category}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(p);
                  }}
                  className={`absolute top-3 right-3 p-2.5 rounded-full shadow-md backdrop-blur-md transition-all duration-300 z-10 ${
                    isInWishlist(p.id)
                      ? "bg-red-500 text-white scale-110"
                      : "bg-white/80 text-slate-400 hover:text-red-500 hover:scale-110"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isInWishlist(p.id) ? "fill-current" : ""}`} />
                </button>
              </div>

              <div className="flex flex-col gap-3 p-5 flex-grow">
                <StarRating rating={p.rating} size={16} showText={true} textSize="text-xs" />
                <h3 className="font-semibold text-base line-clamp-1">{p.name}</h3>
                <p className="text-lg font-bold text-primary">{formatPrice(p.price)}</p>
                <div className="space-y-2 mt-auto">
                  <Button
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => {
                      navigate(`/product/${p.id}`);
                    }}
                  >
                    <ShoppingCart className="h-4 w-4" /> {t("featured.add_to_cart")}
                  </Button>
                  <Button asChild size="sm" variant="outline" className="w-full">
                    <Link to={`/product/${p.id}`}>{t("featured.view_details")}</Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;