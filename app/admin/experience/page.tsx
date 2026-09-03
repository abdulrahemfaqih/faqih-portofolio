"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Experience } from "@/types/supabase";
import { formatExperiencePeriod, formatEmploymentType } from "@/lib/utils";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { Plus, PencilSimple, Trash, Buildings, Spinner } from "@phosphor-icons/react";
import toast from "react-hot-toast";
import { revalidateHomeAction } from "@/app/actions/revalidate";

export default function AdminExperiencePage() {
  const supabase = createClient();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, []);

  async function fetchExperiences() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("experience")
        .select("*")
        .order("display_order", { ascending: true })
        .order("start_year", { ascending: false });

      if (error) throw error;
      setExperiences(data || []);
    } catch (err: any) {
      toast.error("Gagal memuat pengalaman: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("experience")
        .delete()
        .eq("id", deleteTargetId);

      if (error) throw error;
      await revalidateHomeAction();
      toast.success("Pengalaman kerja berhasil dihapus");
      setExperiences((prev) => prev.filter((exp) => exp.id !== deleteTargetId));
      setDeleteTargetId(null);
    } catch (err: any) {
      toast.error("Gagal menghapus: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[--ink-12]">
        <div>
          <h1 className="text-h1 font-[family-name:var(--font-fraunces)] text-[--ink]">
            Pengalaman Kerja
          </h1>
          <p className="text-small text-[--ink-70] mt-1">
            Kelola riwayat karir, posisi, perusahaan, dan tanggung jawab Anda.
          </p>
        </div>
        <Link
          href="/admin/experience/new"
          className="btn-solid text-xs px-4 py-2.5 self-start sm:self-auto inline-flex items-center gap-2 shrink-0"
        >
          <Plus size={16} weight="bold" />
          Tambah Pengalaman
        </Link>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Spinner size={32} className="animate-spin text-[--ink]" />
          <p className="font-[family-name:var(--font-geist-mono)] text-xs text-[--ink-45]">
            Memuat daftar pengalaman...
          </p>
        </div>
      ) : experiences.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-[--ink-12] rounded-sm space-y-3">
          <p className="font-[family-name:var(--font-geist-mono)] text-sm text-[--ink-45]">
            Belum ada pengalaman kerja yang ditambahkan.
          </p>
          <Link
            href="/admin/experience/new"
            className="btn-outline text-xs px-4 py-2 inline-flex items-center gap-2"
          >
            <Plus size={14} weight="bold" />
            Tambahkan Pengalaman Pertama
          </Link>
        </div>
      ) : (
        <div className="card divide-y divide-[--ink-12]">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[--surface-alt]/50 transition-colors"
            >
              <div className="flex items-start gap-4 min-w-0">
                <div className="w-12 h-12 rounded-sm border border-[--ink-12] bg-[--surface-alt] shrink-0 overflow-hidden flex items-center justify-center">
                  {exp.company_logo_url ? (
                    <Image
                      src={exp.company_logo_url}
                      alt={exp.company_name}
                      width={48}
                      height={48}
                      className="object-contain p-1"
                    />
                  ) : (
                    <Buildings size={20} className="text-[--ink-45]" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-semibold text-[--ink]">
                      {exp.position_title}
                    </h3>
                    {exp.employment_type && (
                      <span className="chip text-[0.625rem] bg-[--surface-alt] text-[--ink-70]">
                        {formatEmploymentType(exp.employment_type)}
                      </span>
                    )}
                    {exp.is_current && (
                      <span className="chip text-[0.625rem] bg-[--surface-alt] text-[--ink]">
                        Sekarang
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[--ink-70]">{exp.company_name}</p>
                  <p className="font-[family-name:var(--font-geist-mono)] text-xs text-[--ink-45] mt-1">
                    {formatExperiencePeriod(exp)} • {exp.description_points?.length || 0} poin deskripsi
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <Link
                  href={`/admin/experience/${exp.id}/edit`}
                  className="btn-outline text-xs px-3 py-1.5 inline-flex items-center gap-1"
                >
                  <PencilSimple size={14} />
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => setDeleteTargetId(exp.id)}
                  className="p-1.5 text-red-600 hover:text-red-700 transition-colors rounded-sm"
                  aria-label="Hapus pengalaman"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Hapus Pengalaman Kerja"
        message="Apakah Anda yakin ingin menghapus pengalaman kerja ini? Tindakan ini tidak dapat dibatalkan."
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
