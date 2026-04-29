import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface WhyChooseUsProps {
  data?: {
    title: string;
    items: string[];
  };
}

const WhyChooseUs = ({ data }: WhyChooseUsProps) => {
  const { t } = useTranslation();
  
  const title = data?.title || t("about.title");
  const reasons = data?.items || (t("about.reasons", { returnObjects: true }) as string[]);

  return (
    <section id="about" className="hero-gradient py-20">
      <div className="container grid items-center gap-12 md:grid-cols-2">
        <div>
          <span className="text-sm font-semibold uppercase tracking-widest text-neon-blue">{title}</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-surface-dark-foreground sm:text-4xl">
            {t("about.subtitle")}
          </h2>
          <p className="mt-4 leading-relaxed text-surface-dark-foreground/70">
            {t("about.description")}
          </p>
          <ul className="mt-8 flex flex-col gap-4">
            {Array.isArray(reasons) && reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-3 text-surface-dark-foreground/80">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-neon-blue" />
                <span className="text-sm">{r}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-center">
          <div className="glow-border h-64 w-full max-w-sm rounded-2xl bg-slate-800/50 md:h-80" />
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
