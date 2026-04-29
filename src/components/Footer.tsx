import { Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="hero-gradient border-t py-16 text-surface-dark-foreground">
      <div className="container grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-display text-lg font-bold text-neon-blue">Tech Komputer Store</h3>
          <p className="mt-3 text-sm leading-relaxed text-surface-dark-foreground/60">
            {t("footer.tagline")}
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">{t("footer.quick_links")}</h4>
          <ul className="flex flex-col gap-2 text-sm text-surface-dark-foreground/60">
            <li><Link to="/" className="hover:text-neon-blue">{t("navbar.home")}</Link></li>
            <li><Link to="/products" className="hover:text-neon-blue">{t("navbar.products")}</Link></li>
            <li><Link to="/blog" className="hover:text-neon-blue">{t("navbar.blog")}</Link></li>
            <li><Link to="/about" className="hover:text-neon-blue">{t("navbar.about")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">{t("footer.categories")}</h4>
          <ul className="flex flex-col gap-2 text-sm text-surface-dark-foreground/60">
            <li><Link to="/products?category=Monitor" className="hover:text-neon-blue">Monitor</Link></li>
            <li><Link to="/products?category=Keyboard" className="hover:text-neon-blue">Keyboard</Link></li>
            <li><Link to="/products?category=Headset" className="hover:text-neon-blue">Headset</Link></li>
            <li><Link to="/products?category=Mousepad" className="hover:text-neon-blue">Mousepad</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">{t("footer.contact")}</h4>
          <ul className="flex flex-col gap-3 text-sm text-surface-dark-foreground/60">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-neon-blue" /> hello@techkomputer.id</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-neon-blue" /> +62 812-3456-7890</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-neon-blue" /> Jakarta, Indonesia</li>
          </ul>
        </div>
      </div>

      <div className="container mt-12 border-t border-surface-dark-foreground/10 pt-6 text-center text-xs text-surface-dark-foreground/40">
        © 2024 Tech Komputer Store. {t("footer.copyright")}
      </div>
    </footer>
  );
};

export default Footer;
