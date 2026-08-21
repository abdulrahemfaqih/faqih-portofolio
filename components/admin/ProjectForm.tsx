"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/types/supabase";
import { slugify } from "@/lib/utils";
import ImageUpload from "./ImageUpload";
import TagInput from "./TagInput";
import { ArrowLeft, Spinner, Check } from "@phosphor-icons/react";
import toast from "react-hot-toast";

interface ProjectFormProps {
  initialData?: Project | null;
}

export default function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!initialData;

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(isEdit);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(
    initialData?.thumbnail_url || null
  );
  const [description, setDescription] = useState(initialData?.description || "");
  const [techStack, setTechStack] = useState<string[]>(initialData?.tech_stack || []);
  const [liveUrl, setLiveUrl] = useState(initialData?.live_url || "");
  const [repoUrl, setRepoUrl] = useState(initialData?.repo_url || "");
  const [isFeatured, setIsFeatured] = useState<boolean>(initialData?.is_featured || false);
  const [displayOrder, setDisplayOrder] = useState<number>(initialData?.display_order || 0);
  const [isSaving, setIsSaving] = useState(false);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!isSlugManuallyEdited) {
      setSlug(slugify(val));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !slug.trim() || !description.trim()) {
      toast.error("Judul, Slug, dan Deskripsi proyek wajib diisi");
      return;
    }

    setIsSaving(true);
    try {
      // Cek apakah slug sudah terpakai oleh proyek lain
      const cleanSlug = slugify(slug);
      let query = supabase
        .from("projects")
        .select("id")
        .eq("slug", cleanSlug);

      if (isEdit && initialData) {
        query = query.neq("id", initialData.id);
      }

      const { data: existingSlug } = await query.maybeSingle();
      if (existingSlug) {
        toast.error("Slug URL ini sudah digunakan oleh proyek lain. Gunakan slug yang berbeda.");
        setIsSaving(false);
        return;
      }

      const payload = {
        title: title.trim(),
        slug: cleanSlug,
        thumbnail_url: thumbnailUrl,
        description: description.trim(),
        tech_stack: techStack,
        live_url: liveUrl.trim() || null,
        repo_url: repoUrl.trim() || null,
        is_featured: Boolean(isFeatured),
        display_order: Number(displayOrder) || 0,
      };

      if (isEdit && initialData) {
        const { error } = await supabase
          .from("projects")
          .update(payload)
          .eq("id", initialData.id);
        if (error) throw error;
        toast.success("Proyek berhasil diperbarui");
      } else {
        const { error } = await supabase.from("projects").insert(payload);
        if (error) throw error;
        toast.success("Proyek baru berhasil ditambahkan");
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (err: any) {
      toast.error("Gagal menyimpan: " + err.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-8 max-w-3xl pb-16">
      {/* Back button */}
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-2 font-[family-name:var(--font-geist-mono)] text-xs tracking-wide uppercase text-[--ink-45] hover:text-[--ink] transition-colors"
      >
        <ArrowLeft size={14} weight="bold" />
        Kembali ke Daftar Proyek
      </Link>

      <div className="pb-4 border-b border-[--ink-12]">
        <h1 className="text-h1 font-[family-name:var(--font-fraunces)] text-[--ink]">
          {isEdit ? "Edit Proyek" : "Tambah Proyek Baru"}
        </h1>
        <p className="text-small text-[--ink-70] mt-1">
          {isEdit
            ? `Mengubah rincian proyek ${initialData.title}`
            : "Tambahkan karya atau proyek portofolio baru yang telah Anda bangun."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
              Judul Proyek *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Contoh: Platform E-Commerce Next.js"
              className="px-3 py-2.5 rounded-sm border border-[--ink-12] bg-transparent text-[--ink] text-sm focus-visible:outline-2 focus-visible:outline-[--ink]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
              URL Slug *
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2.5 bg-[--surface-alt] border border-r-0 border-[--ink-12] rounded-l-sm font-[family-name:var(--font-geist-mono)] text-xs text-[--ink-45]">
                /project/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setIsSlugManuallyEdited(true);
                }}
                placeholder="platform-ecommerce-nextjs"
                className="flex-1 px-3 py-2.5 rounded-r-sm border border-[--ink-12] bg-transparent text-[--ink] text-sm font-[family-name:var(--font-geist-mono)] focus-visible:outline-2 focus-visible:outline-[--ink]"
              />
            </div>
          </div>
        </div>

        {/* Thumbnail upload */}
        <div className="pt-2">
          <ImageUpload
            bucket="project-images"
            value={thumbnailUrl}
            onChange={setThumbnailUrl}
            label="Thumbnail / Screenshot Proyek"
            aspectRatio="video"
            helperText="Rasio 16:9 disarankan, tampil di kartu dan detail proyek"
          />
        </div>

        {/* Deskripsi */}
        <div className="flex flex-col gap-1.5">
          <label className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
            Deskripsi Proyek *
          </label>
          <textarea
            rows={5}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Jelaskan tujuan proyek, tantangan yang diselesaikan, dan fitur utama yang dibangun..."
            className="px-3 py-2.5 rounded-sm border border-[--ink-12] bg-transparent text-[--ink] text-sm focus-visible:outline-2 focus-visible:outline-[--ink] resize-y"
          />
        </div>

        {/* Tech Stack */}
        <div className="pt-2">
          <TagInput
            value={techStack}
            onChange={setTechStack}
            label="Tech Stack (Teknologi yang Digunakan)"
            placeholder="Ketik teknologi (misal: Next.js, Supabase, Tailwind) lalu tekan Enter"
          />
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[--ink-12]">
          <div className="flex flex-col gap-1.5">
            <label className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
              Live Site URL (Demo)
            </label>
            <input
              type="url"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://example.com"
              className="px-3 py-2.5 rounded-sm border border-[--ink-12] bg-transparent text-[--ink] text-sm focus-visible:outline-2 focus-visible:outline-[--ink]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
              Repository URL (GitHub / GitLab)
            </label>
            <input
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/project"
              className="px-3 py-2.5 rounded-sm border border-[--ink-12] bg-transparent text-[--ink] text-sm focus-visible:outline-2 focus-visible:outline-[--ink]"
            />
          </div>
        </div>

        {/* Featured & Order */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[--ink-12] items-center">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 accent-[--ink]"
            />
            <div>
              <span className="text-sm font-medium text-[--ink] block">
                Jadikan Proyek Unggulan (Featured)
              </span>
              <span className="text-xs text-[--ink-45] block">
                Proyek unggulan akan diberi lencana khusus di landing page
              </span>
            </div>
          </label>

          <div className="flex flex-col gap-1.5 max-w-xs">
            <label className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
              Urutan Tampil (Display Order)
            </label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="px-3 py-2 text-sm rounded-sm border border-[--ink-12] bg-transparent text-[--ink]"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-6 border-t border-[--ink-12] flex items-center justify-end gap-3">
          <Link href="/admin/projects" className="btn-outline text-xs px-4 py-2.5">
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
                {isEdit ? "Simpan Perubahan" : "Publikasikan Proyek"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
