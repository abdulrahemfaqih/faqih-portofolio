"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/types/supabase";
import ConfirmModal from "@/components/admin/ConfirmModal";
import {
  Plus,
  PencilSimple,
  Trash,
  ArrowUpRight,
  Spinner,
  Star,
} from "@phosphor-icons/react";
import toast from "react-hot-toast";

export default function AdminProjectsPage() {
  const supabase = createClient();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err: any) {
      toast.error("Gagal memuat proyek: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", deleteTargetId);
      if (error) throw error;

      toast.success("Proyek berhasil dihapus");
      setDeleteTargetId(null);
      fetchProjects();
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
            Daftar Proyek
          </h1>
          <p className="text-small text-[--ink-70] mt-1">
            Kelola karya, studi kasus, thumbnail, dan tautan live demo untuk portfolio Anda.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="btn-solid text-xs inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={14} weight="bold" />
          Tambah Proyek Baru
        </Link>
      </div>

      {isLoading ? (
        <div className="py-20 flex items-center justify-center text-[--ink-70] gap-2">
          <Spinner size={24} className="animate-spin" />
          <span className="text-sm font-[family-name:var(--font-geist-mono)]">Memuat proyek...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="card p-12 text-center border-dashed space-y-3">
          <p className="text-sm text-[--ink-70]">
            Belum ada proyek yang ditambahkan ke portfolio Anda.
          </p>
          <Link
            href="/admin/projects/new"
            className="btn-outline text-xs inline-flex items-center gap-1.5"
          >
            <Plus size={14} weight="bold" />
            Tambahkan Proyek Pertama
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p.id}
              className="card overflow-hidden flex flex-col justify-between group hover:border-[--ink-45] transition-colors"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] bg-[--surface-alt] overflow-hidden border-b border-[--ink-12]">
                  {p.thumbnail_url ? (
                    <Image
                      src={p.thumbnail_url}
                      alt={p.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-geist-mono)] text-xs text-[--ink-45] uppercase">
                      No Thumbnail
                    </div>
                  )}

                  {p.is_featured && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-[--ink] text-[--paper] text-[0.625rem] font-[family-name:var(--font-geist-mono)] tracking-wider uppercase rounded-xs">
                      <Star size={10} weight="fill" />
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-base font-semibold text-[--ink] leading-snug">
                      {p.title}
                    </h3>
                    <p className="font-[family-name:var(--font-geist-mono)] text-xs text-[--ink-45] mt-0.5">
                      /project/{p.slug}
                    </p>
                  </div>

                  <p className="text-xs text-[--ink-70] line-clamp-2">
                    {p.description}
                  </p>

                  {/* Tech stack chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.tech_stack.slice(0, 3).map((tech) => (
                      <span key={tech} className="chip text-[0.625rem] py-0.5 px-1.5">
                        {tech}
                      </span>
                    ))}
                    {p.tech_stack.length > 3 && (
                      <span className="chip text-[0.625rem] py-0.5 px-1.5 text-[--ink-45]">
                        +{p.tech_stack.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 pt-3 border-t border-[--ink-12] flex items-center justify-between text-xs">
                <span className="font-[family-name:var(--font-geist-mono)] text-[0.6875rem] text-[--ink-45]">
                  Urutan: {p.display_order}
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/project/${p.slug}`}
                    target="_blank"
                    className="p-1.5 text-[--ink-45] hover:text-[--ink] transition-colors"
                    aria-label="Lihat halaman proyek publik"
                  >
                    <ArrowUpRight size={16} />
                  </Link>
                  <Link
                    href={`/admin/projects/${p.id}/edit`}
                    className="btn-outline text-xs px-2.5 py-1 inline-flex items-center gap-1"
                  >
                    <PencilSimple size={13} />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteTargetId(p.id)}
                    className="p-1.5 text-red-600 hover:text-red-700 transition-colors rounded-sm"
                    aria-label="Hapus proyek"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Hapus Proyek"
        message="Apakah Anda yakin ingin menghapus proyek ini? Halaman detail proyek dan thumbnail terkait tidak akan dapat diakses lagi."
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
