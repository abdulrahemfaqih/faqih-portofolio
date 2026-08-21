"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { BlogPost, PostStatus } from "@/types/supabase";
import { slugify } from "@/lib/utils";
import ImageUpload from "./ImageUpload";
import TagInput from "./TagInput";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import { ArrowLeft, Spinner, Check, Eye, Code } from "@phosphor-icons/react";
import toast from "react-hot-toast";

interface BlogFormProps {
  initialData?: BlogPost | null;
}

export default function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!initialData;

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(isEdit);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    initialData?.cover_image_url || null
  );
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [status, setStatus] = useState<PostStatus>(initialData?.status || "draft");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [isSaving, setIsSaving] = useState(false);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!isSlugManuallyEdited) {
      setSlug(slugify(val));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !slug.trim() || !content.trim()) {
      toast.error("Judul, Slug, dan Konten artikel wajib diisi");
      return;
    }

    setIsSaving(true);
    try {
      // Cek apakah slug sudah terpakai
      const cleanSlug = slugify(slug);
      let query = supabase
        .from("blog_posts")
        .select("id")
        .eq("slug", cleanSlug);

      if (isEdit && initialData) {
        query = query.neq("id", initialData.id);
      }

      const { data: existingSlug } = await query.maybeSingle();
      if (existingSlug) {
        toast.error("Slug URL ini sudah digunakan oleh artikel lain. Gunakan slug yang berbeda.");
        setIsSaving(false);
        return;
      }

      // Logic published_at
      let publishedAt = initialData?.published_at || null;
      if (status === "published" && !publishedAt) {
        publishedAt = new Date().toISOString();
      }

      const payload = {
        title: title.trim(),
        slug: cleanSlug,
        cover_image_url: coverImageUrl,
        excerpt: excerpt.trim() || null,
        content: content.trim(),
        status,
        tags,
        published_at: publishedAt,
      };

      if (isEdit && initialData) {
        const { error } = await supabase
          .from("blog_posts")
          .update(payload)
          .eq("id", initialData.id);
        if (error) throw error;
        toast.success("Artikel berhasil diperbarui");
      } else {
        const { error } = await supabase.from("blog_posts").insert(payload);
        if (error) throw error;
        toast.success(
          status === "published"
            ? "Artikel berhasil dipublikasikan!"
            : "Draf artikel berhasil disimpan!"
        );
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (err: any) {
      toast.error("Gagal menyimpan: " + err.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      {/* Back button */}
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-2 font-[family-name:var(--font-geist-mono)] text-xs tracking-wide uppercase text-[--ink-45] hover:text-[--ink] transition-colors"
      >
        <ArrowLeft size={14} weight="bold" />
        Kembali ke Daftar Blog
      </Link>

      <div className="pb-4 border-b border-[--ink-12] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h1 font-[family-name:var(--font-fraunces)] text-[--ink]">
            {isEdit ? "Edit Artikel Blog" : "Tulis Artikel Baru"}
          </h1>
          <p className="text-small text-[--ink-70] mt-1">
            Format artikel menggunakan Markdown dengan dukungan syntax highlighting kode.
          </p>
        </div>

        {/* Status Selector */}
        <div className="flex items-center gap-2">
          <span className="font-[family-name:var(--font-geist-mono)] text-xs text-[--ink-70] uppercase">
            Status:
          </span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PostStatus)}
            className={`
              px-3 py-1.5 text-xs font-[family-name:var(--font-geist-mono)] uppercase rounded-sm border
              focus-visible:outline-2 focus-visible:outline-[--ink]
              ${
                status === "published"
                  ? "bg-[--ink] text-[--paper] border-[--ink]"
                  : "bg-[--paper] text-[--ink] border-[--ink-12]"
              }
            `}
          >
            <option value="draft">Draf (Draft)</option>
            <option value="published">Terbit (Published)</option>
          </select>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
              Judul Artikel *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Contoh: Belajar Server Actions di Next.js 16"
              className="px-3 py-2.5 rounded-sm border border-[--ink-12] bg-transparent text-[--ink] text-sm focus-visible:outline-2 focus-visible:outline-[--ink]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
              URL Slug *
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2.5 bg-[--surface-alt] border border-r-0 border-[--ink-12] rounded-l-sm font-[family-name:var(--font-geist-mono)] text-xs text-[--ink-45]">
                /blog/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setIsSlugManuallyEdited(true);
                }}
                placeholder="belajar-server-actions-nextjs-16"
                className="flex-1 px-3 py-2.5 rounded-r-sm border border-[--ink-12] bg-transparent text-[--ink] text-sm font-[family-name:var(--font-geist-mono)] focus-visible:outline-2 focus-visible:outline-[--ink]"
              />
            </div>
          </div>
        </div>

        {/* Cover image */}
        <div className="pt-2">
          <ImageUpload
            bucket="blog-images"
            value={coverImageUrl}
            onChange={setCoverImageUrl}
            label="Cover Image Artikel"
            aspectRatio="video"
            helperText="Rasio 16:7 atau 16:9 disarankan"
          />
        </div>

        {/* Excerpt */}
        <div className="flex flex-col gap-1.5">
          <label className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
            Ringkasan (Excerpt)
          </label>
          <textarea
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Ringkasan singkat 1-2 kalimat untuk tampil di kartu daftar artikel..."
            className="px-3 py-2.5 rounded-sm border border-[--ink-12] bg-transparent text-[--ink] text-sm focus-visible:outline-2 focus-visible:outline-[--ink] resize-y"
          />
        </div>

        {/* Tags */}
        <div className="pt-2">
          <TagInput
            value={tags}
            onChange={setTags}
            label="Tags / Topik Artikel"
            placeholder="Ketik topik (misal: Next.js, Architecture, Tutorial) lalu tekan Enter"
          />
        </div>

        {/* Markdown Content Editor with Preview Tab */}
        <div className="pt-4 border-t border-[--ink-12] space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
              Konten Artikel (Markdown) *
            </label>

            {/* Tab switch */}
            <div className="flex items-center border border-[--ink-12] rounded-sm p-0.5 bg-[--surface-alt]">
              <button
                type="button"
                onClick={() => setActiveTab("write")}
                className={`
                  px-3 py-1 text-xs font-[family-name:var(--font-geist-mono)] uppercase rounded-xs flex items-center gap-1.5 transition-colors
                  ${
                    activeTab === "write"
                      ? "bg-[--paper] text-[--ink] shadow-xs font-semibold"
                      : "text-[--ink-45] hover:text-[--ink]"
                  }
                `}
              >
                <Code size={14} />
                Editor
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`
                  px-3 py-1 text-xs font-[family-name:var(--font-geist-mono)] uppercase rounded-xs flex items-center gap-1.5 transition-colors
                  ${
                    activeTab === "preview"
                      ? "bg-[--paper] text-[--ink] shadow-xs font-semibold"
                      : "text-[--ink-45] hover:text-[--ink]"
                  }
                `}
              >
                <Eye size={14} />
                Pratinjau
              </button>
            </div>
          </div>

          {activeTab === "write" ? (
            <textarea
              rows={18}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`# Judul Artikel\n\nTulis artikel Anda menggunakan sintaks Markdown.\n\n## Sub Judul\n\nContoh code block:\n\`\`\`typescript\nconst greeting = "Halo Dunia";\nconsole.log(greeting);\n\`\`\``}
              className="
                w-full px-4 py-3 rounded-sm border border-[--ink-12] bg-transparent text-[--ink]
                font-[family-name:var(--font-geist-mono)] text-sm leading-relaxed
                focus-visible:outline-2 focus-visible:outline-[--ink] resize-y
              "
            />
          ) : (
            <div className="p-6 border border-[--ink-12] rounded-sm bg-[--paper] min-h-[400px]">
              {content.trim() ? (
                <MarkdownRenderer content={content} />
              ) : (
                <p className="text-sm text-[--ink-45] italic text-center py-12">
                  Belum ada konten untuk ditampilkan dalam pratinjau.
                </p>
              )}
            </div>
          )}
          <p className="text-[0.6875rem] text-[--ink-45]">
            Gunakan format ```nama_bahasa (misal: ```typescript, ```python, ```bash) untuk code block.
          </p>
        </div>

        {/* Buttons */}
        <div className="pt-6 border-t border-[--ink-12] flex items-center justify-end gap-3">
          <Link href="/admin/blog" className="btn-outline text-xs px-4 py-2.5">
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="btn-solid text-xs px-6 py-2.5 disabled:opacity-60 inline-flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Spinner size={16} className="animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Check size={16} weight="bold" />
                {isEdit
                  ? "Simpan Perubahan"
                  : status === "published"
                  ? "Terbitkan Sekarang"
                  : "Simpan sebagai Draf"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
