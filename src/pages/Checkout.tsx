import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "react-use-cart";
import { ChevronRight, ShieldCheck, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/data/products";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const Checkout = () => {
  const { items, cartTotal, emptyCart } = useCart();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    shippingAddress: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.shippingAddress.trim()) {
      toast.error(t("checkout.address_required") || "Alamat pengiriman wajib diisi");
      return;
    }

    if (items.length === 0) {
      toast.error(t("cart.empty_title"));
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error(t("auth.login_required") || "Silakan login terlebih dahulu untuk checkout");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        items: items.map((item: any) => {
          return {
            product_id: item.product_id ?? item.productId ?? item.id,
            quantity: item.quantity ?? 1,
          };
        }),
        shipping_address: formData.shippingAddress,
      };

      if (payload.items.some((item: any) => !item.product_id)) {
        toast.error("Ada product_id yang kosong di cart");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/customer/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to place order");
      }

      toast.success(t("checkout.order_success") || "Pesanan berhasil dibuat!");

      // Kosongkan keranjang
      emptyCart();

      // Redirect ke payment URL dari respon
      if (result.checkout_url) {
        window.location.href = result.checkout_url;
      } else if (result.data?.checkout_url) {
        window.location.href = result.data.checkout_url;
      } else if (result.payment_url) {
        window.location.href = result.payment_url;
      } else if (result.data?.payment_url) {
        window.location.href = result.data.payment_url;
      } else {
        console.log("Response order:", result);
        toast.error("Gagal mendapatkan link pembayaran.");
      }
    } catch (error: any) {
      console.error("Order error:", error);
      toast.error(error.message || "Terjadi kesalahan saat memproses pesanan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Breadcrumbs */}
        <nav className="mb-8 flex items-center gap-1 text-sm text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-primary">
            {t("navbar.home")}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/cart" className="transition-colors hover:text-primary">
            {t("navbar.cart")}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">{t("checkout.title")}</span>
        </nav>

        <h1 className="mb-8 font-display text-2xl font-bold text-foreground md:text-3xl">
          {t("checkout.title")}
        </h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left — Shipping Form */}
            <div className="space-y-6 lg:col-span-2">
              {/* Shipping Address Only */}
              <Card className="border-border bg-card p-6">
                <h2 className="mb-4 font-display text-lg font-bold text-foreground">
                  {t("checkout.shipping_address")}
                </h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="shippingAddress">{t("checkout.address")}</Label>
                    <Input
                      id="shippingAddress"
                      placeholder={t("checkout.address_placeholder")}
                      value={formData.shippingAddress}
                      onChange={(e) => handleChange("shippingAddress", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Right — Order Review */}
            <div>
              <Card className="sticky top-24 border-border bg-card p-6">
                <h2 className="mb-4 font-display text-lg font-bold text-foreground">
                  {t("checkout.order_review")}
                </h2>

                <div className="mb-4 max-h-64 space-y-3 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 rounded-md bg-muted overflow-hidden">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          x{item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {formatPrice(item.price * (item.quantity ?? 1))}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                    <span className="text-foreground">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between border-t border-border py-4">
                  <span className="font-display font-bold text-foreground">
                    {t("cart.estimated_total")}
                  </span>
                  <span className="font-display text-lg font-bold text-primary">
                    {formatPrice(cartTotal)}
                  </span>
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2"
                  size="lg"
                  disabled={isSubmitting || items.length === 0}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="h-4 w-4" />
                  )}
                  {isSubmitting ? t("common.processing") || "Memproses..." : t("checkout.place_order")}
                </Button>

                <p className="mt-3 text-center text-xs text-muted-foreground">
                  {t("checkout.secure_info")}
                </p>
              </Card>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
