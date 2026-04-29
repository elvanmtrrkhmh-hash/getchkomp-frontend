import { Link } from "react-router-dom";
import { Search, ArrowRight, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBlog } from "@/context/BlogContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

const BlogListing = () => {
  const { t } = useTranslation();
  const {
    filteredBlogs,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedTag,
    setSelectedTag,
    allCategories,
    allTags,
    loading,
    error,
    usingMockData,
    refreshBlogs,
  } = useBlog();

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-20 text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-lg font-medium text-muted-foreground">{t("blog.loading_articles")}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Page Header */}
      <section className="border-b bg-muted/40 py-12">
        <div className="container text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">Blog</span>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{t("blog.title")}</h1>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            {t("blog.description")}
          </p>
          

        </div>
      </section>

      <div className="container py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* ===== SIDEBAR (25%) ===== */}
          <aside className="w-full shrink-0 space-y-8 lg:w-1/4">
            {/* Search Widget */}
            <div className="rounded-xl border bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">{t("common.search")}</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t("blog.search_placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Categories Widget */}
            <div className="rounded-xl border bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">{t("blog.categories")}</h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      selectedCategory === null
                        ? "bg-primary/10 font-semibold text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {t("blog.all_categories")}
                  </button>
                </li>
                {allCategories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        selectedCategory === cat
                          ? "bg-primary/10 font-semibold text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags Cloud Widget */}
            <div className="rounded-xl border bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">{t("blog.tags")}</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button key={tag} onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}>
                    <Badge
                      variant={selectedTag === tag ? "default" : "outline"}
                      className="cursor-pointer text-xs"
                    >
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ===== MAIN CONTENT (75%) ===== */}
          <main className="flex-1">
            {filteredBlogs.length > 0 && (
              <p className="mb-6 text-sm text-muted-foreground">
                {t("blog.showing_articles", { count: filteredBlogs.length })}
              </p>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              {filteredBlogs.map((blog) => (
                <article
                  key={blog.id}
                  className="card-hover group overflow-hidden rounded-xl border bg-card"
                >
                  <img src={blog.thumbnail} alt={blog.title} className="aspect-video w-full object-cover"/>
                  <div className="flex flex-col gap-3 p-5">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-semibold text-primary">
                        {blog.category}
                      </span>
                      <span>{blog.date}</span>
                    </div>
                    <Link to={`/blog/${blog.id}`}>
                      <h3 className="text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary line-clamp-2">
                        {blog.title}
                      </h3>
                    </Link>
                    <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      {blog.excerpt}
                    </p>
                    
                    {blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0 h-4 normal-case">
                            {tag}
                          </Badge>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className="text-[10px] text-muted-foreground">+{blog.tags.length - 3}</span>
                        )}
                      </div>
                    )}

                    <Link
                      to={`/blog/${blog.id}`}
                      className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                    >
                      {t("blog.read_more")} <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {(filteredBlogs.length === 0 || error) && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="mb-4 rounded-full bg-muted p-4 text-muted-foreground">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{t("blog.no_articles")}</h3>
                <p className="mt-2 text-muted-foreground">{t("blog.try_adjust_filters")}</p>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogListing;
