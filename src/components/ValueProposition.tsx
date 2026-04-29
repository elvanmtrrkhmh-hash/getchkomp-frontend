import { Truck, ShieldCheck, Headphones, CreditCard, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

const iconMap: Record<string, React.ElementType> = {
  truck: Truck,
  shield: ShieldCheck,
  headphones: Headphones,
  'credit-card': CreditCard,
  zap: Zap,
};

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

interface ValuePropositionProps {
  features?: FeatureItem[];
}

const ValueProposition = ({ features }: ValuePropositionProps) => {
  const { t } = useTranslation();

  const defaultItems = [
    { icon: 'truck', title: t("value_prop.shipping.title"), description: t("value_prop.shipping.desc") },
    { icon: 'shield', title: t("value_prop.warranty.title"), description: t("value_prop.warranty.desc") },
    { icon: 'headphones', title: t("value_prop.support.title"), description: t("value_prop.support.desc") },
    { icon: 'credit-card', title: t("value_prop.installment.title"), description: t("value_prop.installment.desc") },
  ];

  const displayItems = features || defaultItems;

  return (
    <section className="border-b bg-card py-10">
      <div className="container grid grid-cols-2 gap-6 md:grid-cols-4">
        {displayItems.map((item, index) => {
          const Icon = iconMap[item.icon] || Zap;
          return (
            <div key={index} className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.description || (item as any).desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ValueProposition;
