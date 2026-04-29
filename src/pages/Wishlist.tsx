import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ArrowLeft, PackageSearch } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/data/products";
import { resolveImageUrl, getSafeSrc, getPlaceholderImage } from "@/utils/imageUtils";
import { getDisplayPrice } from "@/utils/productUtils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <Link to="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4 group">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Kembali ke Toko
              </Link>
              <h1 className="text-4xl font-display font-bold text-foreground">Wishlist Saya</h1>
              <p className="text-muted-foreground mt-2">Simpan produk favorit Anda dan akses kapan saja.</p>
            </div>
            
            {wishlist.length > 0 && (
              <div className="bg-primary/5 px-6 py-4 rounded-2xl border border-primary/10">
                <p className="text-sm font-medium text-primary">
                  Total Favorit: <span className="text-xl font-bold ml-1">{wishlist.length}</span>
                </p>
              </div>
            )}
          </div>

          {/* Content */}
          {wishlist.length === 0 ? (
            <div className="text-center py-24 bg-card rounded-3xl border border-border shadow-sm">
              <div className="bg-primary/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                <Heart className="h-12 w-12 text-primary/40" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">Wishlist Kosong</h2>
              <p className="text-muted-foreground max-w-sm mx-auto mb-10 leading-relaxed">
                Anda belum menambahkan produk apa pun ke favorit. Mulai jelajahi produk teknologi terbaik kami!
              </p>
              <Button onClick={() => navigate("/products")} size="lg" className="rounded-full px-10 shadow-lg hover:shadow-xl transition-all h-14">
                Mulai Belanja
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlist.map((product) => (
                <Card key={product.id} className="overflow-hidden group bg-card border-border transition-all hover:shadow-xl flex flex-col h-full rounded-3xl">
                  <div className="aspect-square relative overflow-hidden bg-muted">
                    <img 
                      src={getSafeSrc(resolveImageUrl(product.thumbnail) || resolveImageUrl(product.images?.[0]))} 
                      alt={product.name} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getPlaceholderImage();
                      }}
                    />
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFromWishlist(product.id);
                      }}
                      className="absolute top-4 right-4 p-3 rounded-full bg-white/90 shadow-lg text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 backdrop-blur-md z-30 cursor-pointer"
                      title="Hapus dari Favorit"
                    >
                      <Trash2 size={20} />
                    </button>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                       <span className="text-white text-xs font-bold uppercase tracking-widest">{product.category}</span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-display font-bold text-foreground text-lg leading-tight mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-2xl font-black text-primary mb-6">{formatPrice(getDisplayPrice(product))}</p>
                    
                    <div className="mt-auto grid grid-cols-1 gap-3">
                      <Button
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="w-full h-12 rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
                      >
                        Lihat Detail
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;
