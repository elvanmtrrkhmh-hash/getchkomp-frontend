import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Facebook, Twitter, Linkedin, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blogs as mockBlogs, type Blog } from "@/data/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { articleService } from "@/services/articleService";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const result = await articleService.getArticleById(id);
        
        if (result.success && result.data) {
          setBlog(result.data);
        } else {
          throw new Error(result.error || t("blog.article_not_found"));
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t("blog.no_articles_desc");
        console.error("[BlogDetail] Error:", errorMessage);
        setError(errorMessage);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, t]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-32 text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-lg font-medium text-muted-foreground">{t("blog.loading_content")}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog || error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container flex flex-col items-center justify-center py-32 text-center">
          <h1 className="text-2xl font-bold">{t("blog.article_not_found")}</h1>
          <p className="mt-2 text-muted-foreground">{error || t("blog.article_not_found_desc")}</p>
          <Link to="/blog">
            <Button className="mt-6">
              <ArrowLeft className="mr-2 h-4 w-4" /> {t("blog.back_to_blog")}
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <article className="container mx-auto max-w-3xl py-10">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">{t("navbar.home")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/blog">{t("navbar.blog")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1 max-w-[200px]">{blog.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Category */}
        <Badge className="mb-4">{blog.category}</Badge>

        {/* Title */}
        <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {blog.title}
        </h1>

        {/* Meta */}
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <User className="h-4 w-4" /> {blog.author}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> {blog.date}
          </span>
        </div>

        {/* Featured Image */}
        <img src={blog.image} alt={blog.title} className="mt-8 aspect-video w-full rounded-xl object-cover"/>

        {/* Content */}
        <div className="prose prose-slate mt-10 max-w-none dark:prose-invert">
          {blog.content.split(". ").reduce<string[][]>((acc, sentence, i) => {
            const pIdx = Math.floor(i / 3);
            if (!acc[pIdx]) acc[pIdx] = [];
            acc[pIdx].push(sentence);
            return acc;
          }, []).map((sentences, i) => (
            <p key={i} className="mb-4 leading-relaxed text-muted-foreground">
              {sentences.join(". ")}{sentences[sentences.length - 1].endsWith(".") ? "" : "."}
            </p>
          ))}
        </div>

        {/* Tags */}
        <div className="mt-10 border-t pt-6">
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">{t("blog.tags")}</h4>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Share Buttons */}
        <div className="mt-8 border-t pt-6">
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">{t("blog.share")}</h4>
          <div className="flex gap-2">
            <Button variant="outline" size="icon"><Facebook className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon"><Twitter className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon"><Linkedin className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon"><Share2 className="h-4 w-4" /></Button>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-10">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">
            <ArrowLeft className="h-4 w-4" /> {t("blog.back_to_all")}
          </Link>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogDetail;
