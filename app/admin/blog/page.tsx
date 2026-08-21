"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { BlogPost } from "@/types/supabase";
import { formatPublishedDate } from "@/lib/utils";
import ConfirmModal from "@/components/admin/ConfirmModal";
import {
  Plus,
  PencilSimple,
  Trash,
  ArrowUpRight,
  Spinner,
  Article,
} from "@phosphor-icons/react";
import toast from "react-hot-toast";

export default function AdminBlogPage() {
  const supabase = createClient();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err: any) {
      toast.error("Gagal memuat artikel: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", deleteTargetId);
      if (error) throw error;

      toast.success("Artikel berhasil dihapus");
      setDeleteTargetId(null);
      fetchPosts();
    } catch (err: any) {
      toast.error("Gagal menghapus: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[--ink-12]">
        <div>
          <span className="eyebrow-label mb-2">Manajemen Konten</span>
          <h1 className="text-h1 font-[family-name:var(--font-fraunces)] text-[--ink]">
            Artikel Blog
          </h1>
          <p className="text-small text-[--ink-70] mt-1">
            Kelola tulisan teknis, catatan arsitektur, dan tutorial dengan status terbit atau draf.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="btn-solid text-xs inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={14} weight="bold" />
          Tulis Artikel Baru
        </Link>
      </div>

      {isLoading ? (
        <div className="py-20 flex items-center justify-center text-[--ink-70] gap-2">
          <Spinner size={24} className="animate-spin" />
          <span className="text-sm font-[family-name:var(--font-geist-mono)]">Memuat artikel...</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="card p-12 text-center border-dashed space-y-3">
          <p className="text-sm text-[--ink-70]">
            Belum ada artikel blog yang ditulis.
          </p>
          <Link
            href="/admin/blog/new"
            className="btn-outline text-xs inline-flex items-center gap-1.5"
          >
            <Plus size={14} weight="bold" />
            Tulis Artikel Pertama
          </Link>
        </div>
      ) : (
        <div className="card divide-y divide-[--ink-12]">
          {posts.map((post) => {
            const isPublished = post.status === "published";
            return (
              <div
                key={post.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[--surface-alt]/50 transition-colors"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-20 h-14 rounded-sm border border-[--ink-12] bg-[--surface-alt] shrink-0 overflow-hidden relative">
                    {post.cover_image_url ? (
                      <Image
                        src={post.cover_image_url}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[--ink-45]">
                        <Article size={20} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className={`
                          px-2 py-0.5 rounded-xs text-[0.625rem] font-[family-name:var(--font-geist-mono)] tracking-wider uppercase font-semibold
                          ${
                            isPublished
                              ? "bg-[--ink] text-[--paper]"
                              : "bg-[--surface-alt] text-[--ink-70] border border-[--ink-12]"
                          }
                        `}
                      >
                        {isPublished ? "Terbit" : "Draf"}
                      </span>
                      <h3 className="text-base font-semibold text-[--ink] truncate">
                        {post.title}
                      </h3>
                    </div>

                    <p className="font-[family-name:var(--font-geist-mono)] text-xs text-[--ink-45]">
                      /blog/{post.slug}
                    </p>

                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {post.published_at && (
                        <span className="font-[family-name:var(--font-geist-mono)] text-[0.6875rem] text-[--ink-45]">
                          {formatPublishedDate(post.published_at)}
                        </span>
                      )}
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="chip text-[0.625rem] py-0.5 px-1.5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {isPublished && (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="p-1.5 text-[--ink-45] hover:text-[--ink] transition-colors"
                      aria-label="Lihat artikel publik"
                    >
                      <ArrowUpRight size={16} />
                    </Link>
                  )}
                  <Link
                    href={`/admin/blog/${post.id}/edit`}
                    className="btn-outline text-xs px-3 py-1.5 inline-flex items-center gap-1"
                  >
                    <PencilSimple size={14} />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteTargetId(post.id)}
                    className="p-1.5 text-red-600 hover:text-red-700 transition-colors rounded-sm"
                    aria-label="Hapus artikel"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Hapus Artikel Blog"
        message="Apakah Anda yakin ingin menghapus artikel ini? Tulisan dan konten di dalamnya akan dihapus secara permanen."
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
