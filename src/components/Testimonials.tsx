import { Star, Quote } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TestimonialItem {
  name: string;
  role: string;
  content: string;
  rating?: number;
}

interface TestimonialsProps {
  testimonials?: TestimonialItem[];
}

const Testimonials = ({ testimonials }: TestimonialsProps) => {
  const { t } = useTranslation();

  const defaultReviews = [
    { name: "Andi R.", role: t("testimonials.reviews.andi.role"), text: t("testimonials.reviews.andi.text"), rating: 5 },
    { name: "Sari W.", role: t("testimonials.reviews.sari.role"), text: t("testimonials.reviews.sari.text"), rating: 5 },
    { name: "Budi P.", role: t("testimonials.reviews.budi.role"), text: t("testimonials.reviews.budi.text"), rating: 4 },
  ];

  const displayReviews = testimonials?.map(t => ({
    name: t.name,
    role: t.role,
    text: t.content,
    rating: t.rating || 5
  })) || defaultReviews;

  return (
    <section className="py-20">
      <div className="container">
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            {t("testimonials.badge")}
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {t("testimonials.title")}
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayReviews.map((r) => (
            <div key={r.name} className="card-hover relative rounded-xl border bg-card p-6">
              <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/10" />
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">"{r.text}"</p>
              <div>
                <p className="text-sm font-semibold">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
