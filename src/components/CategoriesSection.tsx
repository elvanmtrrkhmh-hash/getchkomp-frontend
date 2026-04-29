import { Monitor, Keyboard, Mouse, Headphones, Square } from "lucide-react";
import { useTranslation } from "react-i18next";

const iconMap: Record<string, React.ElementType> = {
  Monitor,
  Keyboard,
  Mouse,
  Headset: Headphones,
  Mousepad: Square,
  Headphones: Headphones, // Add alias
};

interface CategoryItem {
  id: number;
  name: string;
  image_url?: string | null;
}

interface CategoriesSectionProps {
  categories: CategoryItem[];
}

const CategoriesSection = ({ categories }: CategoriesSectionProps) => {
  const { t } = useTranslation();

  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-20">
      <div className="container">
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">{t("products.categories")}</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{t("products.all_categories")}</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {categories.map((cat) => {
            const Icon = iconMap[cat.name] || Monitor;
            return (
              <button
                key={cat.id}
                className="card-hover flex flex-col items-center gap-4 rounded-xl border bg-card p-6 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-7 w-7" />
                </div>
                <span className="text-sm font-semibold">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
