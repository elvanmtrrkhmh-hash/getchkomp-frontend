import { Target, Eye, Zap, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

const teamMembers = [
  { name: "Andi Prasetyo", role: "Founder & CEO", image: "bg-slate-600" },
  { name: "Sari Dewi", role: "Head of Product", image: "bg-zinc-600" },
  { name: "Budi Santoso", role: "Lead Developer", image: "bg-gray-600" },
  { name: "Rina Marlina", role: "Marketing Manager", image: "bg-neutral-600" },
];

const About = () => {
  const { t } = useTranslation();

  const stats = [
    { value: "10K+", label: t("about.stats.products_sold") },
    { value: "5K+", label: t("about.stats.happy_customers") },
    { value: "50+", label: t("about.stats.brand_partners") },
    { value: "4.9", label: t("about.stats.average_rating") },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Banner */}
      <section className="hero-gradient py-24 text-center">
        <div className="container">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            {t("about.badge")}
          </span>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-[hsl(var(--surface-dark-foreground))] sm:text-5xl">
            {t("about.our_story")}
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-[hsl(var(--surface-dark-foreground)/0.7)]">
            {t("about.story_desc")}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{t("about.mission_title")}</h3>
                  <p className="mt-1 leading-relaxed text-muted-foreground">
                    {t("about.mission_desc")}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{t("about.vision_title")}</h3>
                  <p className="mt-1 leading-relaxed text-muted-foreground">
                    {t("about.vision_desc")}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{t("about.values_title")}</h3>
                  <p className="mt-1 leading-relaxed text-muted-foreground">
                    {t("about.values_desc")}
                  </p>
                </div>
              </div>
            </div>

            {/* Image placeholder */}
            <div className="aspect-square rounded-2xl bg-muted" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/40 py-16">
        <div className="container grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-3xl font-bold text-primary">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              {t("about.team_badge")}
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {t("about.team_title")}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              {t("about.team_desc")}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((m) => (
              <div key={m.name} className="card-hover rounded-xl border bg-card p-6 text-center">
                <div className={`${m.image} mx-auto h-24 w-24 rounded-full`} />
                <h3 className="mt-4 font-semibold">{m.name}</h3>
                <p className="text-sm text-muted-foreground">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-gradient py-16 text-center">
        <div className="container">
          <Zap className="mx-auto h-8 w-8 text-primary" />
          <h2 className="mt-4 font-display text-2xl font-bold text-[hsl(var(--surface-dark-foreground))] sm:text-3xl">
            {t("about.cta_title")}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[hsl(var(--surface-dark-foreground)/0.7)]">
            {t("about.cta_desc")}
          </p>
          <a href="/products">
            <button className="mt-6 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              {t("about.browse_products")}
            </button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
