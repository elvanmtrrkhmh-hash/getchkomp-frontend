import { ArrowRight } from "lucide-react";
import { useBlog } from "@/context/BlogContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Blog } from "@/data/products";

interface BlogSectionProps {
  articles?: Blog[];
}

const BlogSection = ({ articles }: BlogSectionProps) => {
  const { blogPosts, loading, error } = useBlog();
  const { t } = useTranslation();
  
  // Use articles from props if provided, otherwise fallback to context
  const displayArticles = articles || blogPosts.slice(0, 3);

  if (loading && displayArticles.length === 0) {
    return (
      <section id="blog" className="border-t bg-muted/50 py-20">
        <div className="container text-center">
          <p className="text-muted-foreground animate-pulse">{t("common.loading")}</p>
        </div>
      </section>
    );
  }

  if (error && displayArticles.length === 0) {
    return (
      <section id="blog" className="border-t bg-muted/50 py-20">
        <div className="container text-center">
          <p className="text-sm font-medium text-destructive">{t("common.error")}</p>
        </div>
      </section>
    );
  }

  if (displayArticles.length === 0) return null;

  return (
    <section id="blog" className="border-t bg-muted/50 py-20">
      <div className="container">
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">{t("navbar.blog")}</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{t("blog.latest_news")}</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayArticles.map((b) => (
            <article key={b.id} className="card-hover group overflow-hidden rounded-xl border bg-card">
              <img src={b.thumbnail || b.image} alt={b.title} className="h-44 w-full object-cover" />
              <div className="flex flex-col gap-3 p-5">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-semibold text-primary">
                    {b.category}
                  </span>
                  <span>{b.date}</span>
                </div>
                <h3 className="text-sm font-semibold leading-snug line-clamp-2">{b.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">{b.excerpt}</p>
                <Link to={`/blog/${b.id}`} className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary/80">
                  {t("blog.read_more")} <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
