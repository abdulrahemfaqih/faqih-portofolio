import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { getPublishedBlogPosts } from "@/lib/queries";
import { formatPublishedDate } from "@/lib/utils";
import type { BlogPostSummary } from "@/types/supabase";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSocialLinks } from "@/lib/queries";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Blog",
  description: "Tulisan tentang pengembangan web, teknologi, dan proses berpikir di balik proyek-proyek saya.",
  openGraph: {
    title: "Blog | Abdul Rahem Faqih",
    description: "Tulisan tentang pengembangan web, teknologi, dan proses berpikir di balik proyek-proyek saya.",
  },
};

export const revalidate = 60; // ISR: revalidate setiap 60 detik

interface BlogCardProps {
  post: BlogPostSummary;
  index: number;
}

function BlogCard({ post, index }: BlogCardProps) {
  return (
    <ScrollReveal delay={index * 0.08}>
      <Link
        href={`/blog/${post.slug}`}
        className="group flex gap-6 py-6 border-b border-[--ink-12] hover:border-[--ink-45] transition-colors duration-200"
        data-cursor="Baca"
      >
        {/* Cover image — thumbnail kecil di kiri */}
        {post.cover_image_url && (
          <div className="shrink-0 relative w-28 h-20 overflow-hidden rounded-sm border border-[--ink-12]">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              sizes="112px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
          </div>
        )}

        {/* Konten */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-h2 font-[family-name:var(--font-fraunces)] text-[--ink] leading-snug group-hover:underline underline-offset-4">
              {post.title}
            </h2>
            <ArrowUpRight
              size={18}
              weight="light"
              className="shrink-0 text-[--ink-45] mt-1 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[--ink]"
            />
          </div>

          {post.excerpt && (
            <p className="mt-2 text-small text-[--ink-70] line-clamp-2">
              {post.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-3">
            {post.published_at && (
              <span className="font-[family-name:var(--font-geist-mono)] text-xs text-[--ink-45]">
                {formatPublishedDate(post.published_at)}
              </span>
            )}
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="chip">{tag}</span>
            ))}
          </div>
        </div>
      </Link>
    </ScrollReveal>
  );
}

export default async function BlogPage() {
  const [posts, socialLinks] = await Promise.all([
    getPublishedBlogPosts(),
    getSocialLinks(),
  ]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="container-main pt-28 pb-20">
          <SectionHeader
            eyebrow="Blog"
            title="Tulisan & pemikiran"
            description="Catatan tentang pengembangan web, proses desain teknis, dan pelajaran dari proyek nyata."
          />

          {posts.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-[--ink-12] rounded-sm">
              <p className="font-[family-name:var(--font-geist-mono)] text-sm text-[--ink-45]">
                Belum ada tulisan yang dipublikasikan.
              </p>
            </div>
          ) : (
            <div>
              {posts.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer socialLinks={socialLinks} />
    </>
  );
}
