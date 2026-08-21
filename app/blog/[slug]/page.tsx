import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { getBlogPostBySlug, getSocialLinks } from "@/lib/queries";
import { createBuildTimeClient } from "@/lib/supabase/build-client";
import { formatPublishedDate } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

interface Params {
  params: Promise<{ slug: string }>;
}

// Menggunakan build-time client (tanpa cookies) karena berjalan di build time
export async function generateStaticParams() {
  const supabase = createBuildTimeClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("status", "published");
  return (data ?? []).map((p: { slug: string }) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt ?? post.content.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt ?? post.content.slice(0, 160),
      type: "article",
      publishedTime: post.published_at ?? undefined,
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: Params) {
  const { slug } = await params;
  const [post, socialLinks] = await Promise.all([
    getBlogPostBySlug(slug),
    getSocialLinks(),
  ]);

  if (!post) notFound();

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <article className="container-main pt-28 pb-20 max-w-[760px]">
          {/* Back link */}
          <Link
            href="/blog"
            className="
              inline-flex items-center gap-2 mb-10
              font-[family-name:var(--font-geist-mono)] text-xs tracking-wide uppercase
              text-[--ink-45] hover:text-[--ink] transition-colors duration-200
            "
          >
            <ArrowLeft size={14} weight="bold" />
            Semua Tulisan
          </Link>

          {/* Cover image */}
          {post.cover_image_url && (
            <div className="relative aspect-[16/7] w-full overflow-hidden rounded-sm border border-[--ink-12] mb-10">
              <Image
                src={post.cover_image_url}
                alt={post.title}
                fill
                sizes="760px"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Header artikel */}
          <header className="mb-10">
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span key={tag} className="chip">{tag}</span>
                ))}
              </div>
            )}

            <h1 className="text-h1 font-[family-name:var(--font-fraunces)] text-[--ink] leading-tight mb-4">
              {post.title}
            </h1>

            {/* Meta: tanggal */}
            <div className="flex items-center gap-4 pb-8 border-b border-[--ink-12]">
              {post.published_at && (
                <time
                  dateTime={post.published_at}
                  className="font-[family-name:var(--font-geist-mono)] text-xs text-[--ink-45]"
                >
                  {formatPublishedDate(post.published_at)}
                </time>
              )}
            </div>
          </header>

          {/* Konten Markdown */}
          <MarkdownRenderer content={post.content} />
        </article>
      </main>
      <Footer socialLinks={socialLinks} />
    </>
  );
}
