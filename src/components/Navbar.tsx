import { useState } from "react";
import { useCart } from "react-use-cart";
import { useWishlist } from "@/context/WishlistContext";
import { Search, ShoppingCart, Menu, X, Globe, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import UserDropdown from "@/components/UserDropdown";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { customer } = useAuth();
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const navLinks = [
    { label: t("navbar.home"), href: "/" },
    { label: t("navbar.products"), href: "/products" },
    { label: t("navbar.blog"), href: "/blog" },
    { label: t("navbar.about"), href: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold tracking-tight text-primary">
          Tech Komputer Store
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link to={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLanguage("en")} className={i18n.language.startsWith("en") ? "bg-accent" : ""}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage("id")} className={i18n.language.startsWith("id") ? "bg-accent" : ""}>
                Bahasa Indonesia
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Search className="h-5 w-5" />
          </Button>

          {/* User - Conditional Render */}
          {customer ? (
            <UserDropdown />
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Button>
            </Link>
          )}

          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-in zoom-in duration-300 shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Button>
          </Link>

          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-in zoom-in duration-300">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
          
          <Button variant="ghost" size="icon" className="text-muted-foreground md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-card md:hidden">
          <ul className="container flex flex-col gap-4 py-4">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link to={l.href} className="text-sm font-medium text-foreground" onClick={() => setMobileOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="flex gap-4 pt-2 border-t mt-2">
              <Button variant="ghost" size="sm" onClick={() => {changeLanguage("en"); setMobileOpen(false);}} className={`text-xs ${i18n.language.startsWith("en") ? "bg-accent" : ""}`}>
                EN
              </Button>
              <Button variant="ghost" size="sm" onClick={() => {changeLanguage("id"); setMobileOpen(false);}} className={`text-xs ${i18n.language.startsWith("id") ? "bg-accent" : ""}`}>
                ID
              </Button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
