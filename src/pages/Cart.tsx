import { Link } from "react-router-dom";
import { useCart } from "react-use-cart";
import { ShoppingCart, Trash2, Minus, Plus, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/data/products";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Cart = () => {
  const { customer } = useAuth();
  const { t } = useTranslation();
  const {
    items,
    isEmpty,
    totalUniqueItems,
    cartTotal,
    updateItemQuantity,
    removeItem,
    emptyCart,
    getItem,
  } = useCart();

  const tax = cartTotal * 0.1;
  const grandTotal = cartTotal + tax;
  

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <div className="mx-auto max-w-md">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="mb-2 font-display text-2xl font-bold text-foreground">
              {t("cart.empty_title")}
            </h1>
            <p className="mb-8 text-muted-foreground">
              {t("cart.empty_desc")}
            </p>
            <Button asChild size="lg">
              <Link to="/products">{t("cart.start_shopping")}</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              {t("cart.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {totalUniqueItems > 1 
                ? t("cart.items_count_plural", { count: totalUniqueItems }) 
                : t("cart.items_count", { count: totalUniqueItems })}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-destructive hover:text-destructive"
            onClick={() => emptyCart()}
          >
            <Trash2 className="h-4 w-4" />
            {t("cart.clear_cart")}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left — Item List */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-border bg-card">
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="w-[300px]">{t("cart.product")}</TableHead>
                      <TableHead className="text-center">{t("cart.quantity")}</TableHead>
                      <TableHead className="text-right">{t("cart.subtotal")}</TableHead>
                      <TableHead className="w-[50px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id} className="border-border">
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <img
                            src={(item as any).image}
                            alt={item.name}
                            className="h-16 w-16 shrink-0 rounded-md object-cover bg-muted"
                            loading="lazy" />
                            <div>
                              <p className="font-display font-semibold text-foreground leading-tight">
                                {item.name}
                              </p>
                              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                                {item.color && (
                                  <span className="text-muted-foreground">
                                    {t("cart.color")}: <span className="font-medium text-foreground">{item.color}</span>
                                  </span>
                                )}
                                {item.selectedOptions && Object.entries(item.selectedOptions as Record<string, string>).map(([key, value]) => (
                                  <span key={key} className="text-muted-foreground">
                                    {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}: <span className="font-medium text-foreground">{value}</span>
                                  </span>
                                ))}
                              </div>
                              <p className="mt-1 text-sm font-bold text-primary">
                                {formatPrice(item.price)}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                const currentQty = getItem(item.id)?.quantity ?? item.quantity ?? 1;
                                const nextQty = Math.max(1, currentQty - 1);
                                updateItemQuantity(item.id, nextQty);}}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium text-foreground">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                const currentQty = getItem(item.id)?.quantity ?? item.quantity ?? 1;
                                updateItemQuantity(item.id, currentQty + 1);}}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-foreground">
                          {formatPrice(item.price * (item.quantity ?? 1))}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="space-y-4 p-4 md:hidden">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-lg border border-border p-3"
                  >
                    <img
                    src={(item as any).image}
                    alt={item.name}
                    className="h-20 w-20 shrink-0 rounded-md object-cover bg-muted"
                    loading="lazy" />
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="font-display text-sm font-semibold text-foreground leading-tight">
                          {item.name}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px]">
                          {item.color && (
                            <span className="text-muted-foreground">
                              {t("cart.color")}: <span className="font-medium text-foreground">{item.color}</span>
                            </span>
                          )}
                          {item.selectedOptions && Object.entries(item.selectedOptions as Record<string, string>).map(([key, value]) => (
                            <span key={key} className="text-muted-foreground">
                              {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}: <span className="font-medium text-foreground">{value}</span>
                            </span>
                          ))}
                        </div>
                        <p className="mt-1 text-sm font-bold text-primary">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => {
                              const currentQty = getItem(item.id)?.quantity ?? item.quantity ?? 1;
                              const nextQty = Math.max(1, currentQty - 1);
                              updateItemQuantity(item.id, nextQty);
                            }}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-xs font-medium text-foreground">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => {
                              const currentQty = getItem(item.id)?.quantity ?? item.quantity ?? 1;
                              updateItemQuantity(item.id, currentQty + 1);}}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Button
              asChild
              variant="ghost"
              className="mt-4 gap-2 text-muted-foreground"
            >
              <Link to="/products">
                <ArrowLeft className="h-4 w-4" />
                {t("cart.continue_shopping")}
              </Link>
            </Button>
          </div>

          {/* Right — Order Summary */}
          <div>
            <Card className="border-border bg-card p-6">
              <h2 className="mb-6 font-display text-lg font-bold text-foreground">
                {t("cart.summary")}
              </h2>

              <div className="space-y-3 border-b border-border pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                  <span className="font-medium text-foreground">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("cart.tax")}</span>
                  <span className="font-medium text-foreground">
                    {formatPrice(tax)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("cart.shipping")}</span>
                  <span className="text-sm text-primary">
                    {t("cart.calculate_at_checkout")}
                  </span>
                </div>
              </div>

              <div className="flex justify-between py-4">
                <span className="font-display text-base font-bold text-foreground">
                  {t("cart.estimated_total")}
                </span>
                <span className="font-display text-lg font-bold text-primary">
                  {formatPrice(grandTotal)}
                </span>
              </div>

              <Button asChild className="w-full" size="lg" variant={customer ? "default" : "outline"}>
                {customer ? (
                  <Link to="/checkout">{t("cart.proceed_to_checkout")}</Link>
                ) : (
                  <Link to="/login">{t("cart.login_to_checkout")}</Link>
                )}
              </Button>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
