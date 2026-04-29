import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.png";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  data?: {
    title: string;
    subtitle: string;
    image_url: string | null;
    cta_link: string;
  };
}

const HeroSection = ({ data }: HeroSectionProps) => {
  const { t } = useTranslation();

  const title = data?.title || t("hero.title");
  const subtitle = data?.subtitle || t("hero.description");
  const image = data?.image_url || heroImage;
  const ctaLink = data?.cta_link || "/products";

  return (
    <section className="hero-gradient relative overflow-hidden">
      <div className="container grid min-h-[85vh] items-center gap-8 py-16 md:grid-cols-2">
        {/* Text */}
        <div className="relative z-10 flex flex-col gap-6 text-surface-dark-foreground">
          <span className="flex w-fit items-center gap-2 rounded-full border border-neon-blue/30 bg-neon-blue/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-neon-blue">
            <Zap className="h-3.5 w-3.5" /> {t("hero.badge")}
          </span>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-glow sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="max-w-md text-base leading-relaxed text-surface-dark-foreground/70 sm:text-lg">
            {subtitle}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button asChild size="lg" className="gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40">
              <Link to={ctaLink}>
                {t("hero.cta_primary")} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-surface-dark-foreground/60 bg-surface-dark-foreground/5 text-surface-dark-foreground hover:bg-surface-dark-foreground/20 hover:border-surface-dark-foreground/80 transition-all duration-300">
              {t("hero.cta_secondary")}
            </Button>
          </div>
        </div>

        {/* Image */}
        <div className="relative flex items-center justify-center">
          <div className="animate-pulse-glow overflow-hidden rounded-2xl">
            <img
              src={image}
              alt="Gaming setup with ultrawide monitor"
              className="w-full max-w-lg rounded-2xl object-cover opacity-90"
            />
          </div>
        </div>
      </div>

      {/* Decorative gradient orb */}
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-neon-blue/10 blur-3xl" />
      <div className="pointer-events-none absolute -top-20 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
    </section>
  );
};

export default HeroSection;
