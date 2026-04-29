import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ValueProposition from "@/components/ValueProposition";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyChooseUs from "@/components/WhyChooseUs";
import CategoriesSection from "@/components/CategoriesSection";
import BlogSection from "@/components/BlogSection";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { homeService, type HomeData } from "@/services/homeService";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomeData = async () => {
    setLoading(true);
    setError(null);
    const result = await homeService.getHomeData();
    if (result.success && result.data) {
      setData(result.data);
    } else {
      setError(result.error || "Failed to load homepage data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground animate-pulse">{t("common.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
        <h2 className="text-2xl font-bold text-destructive mb-2">{t("common.error")}</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={fetchHomeData}>{t("common.retry") || "Retry"}</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection data={data?.hero} />
      <ValueProposition features={data?.features} />
      <FeaturedProducts products={data?.favorite_products || []} />
      <WhyChooseUs data={data?.why_choose_us} />
      <CategoriesSection categories={data?.categories || []} />
      <BlogSection articles={data?.latest_articles} />
      <Testimonials testimonials={data?.testimonials} />
      <Footer />
    </div>
  );
};

export default Index;
