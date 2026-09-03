"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Skill, SkillCategory } from "@/types/supabase";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { Plus, Trash, PencilSimple, Spinner } from "@phosphor-icons/react";
import toast from "react-hot-toast";
import { revalidateHomeAction } from "@/app/actions/revalidate";

const CATEGORIES: { value: SkillCategory; label: string; description: string }[] = [
  {
    value: "programming_language",
    label: "Bahasa Pemrograman",
    description: "Contoh: TypeScript, Python, PHP, JavaScript, Go",
  },
  {
    value: "framework_library",
    label: "Framework & Libraries",
    description: "Contoh: Next.js, React, Laravel, Tailwind CSS, Node.js",
  },
  {
    value: "database",
    label: "Database",
    description: "Contoh: PostgreSQL, MySQL, MongoDB, Redis, Supabase",
  },
  {
    value: "tools_practice",
    label: "Tools & Praktik",
    description: "Contoh: Git, Docker, CI/CD, Agile, Linux, Figma",
  },
];

export default function AdminSkillsPage() {
  const supabase = createClient();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SkillCategory>("programming_language");

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillName, setSkillName] = useState("");
  const [skillCategory, setSkillCategory] = useState<SkillCategory>("programming_language");
  const [skillOrder, setSkillOrder] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchSkills() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("category")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setSkills(data || []);
    } catch (err: any) {
      toast.error("Gagal memuat keahlian: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }

  function openAddModal(category?: SkillCategory) {
    setEditingSkill(null);
    setSkillName("");
    setSkillCategory(category || activeTab);
    const catSkills = skills.filter((s) => s.category === (category || activeTab));
    setSkillOrder(catSkills.length);
    setIsModalOpen(true);
  }

  function openEditModal(skill: Skill) {
    setEditingSkill(skill);
    setSkillName(skill.name);
    setSkillCategory(skill.category);
    setSkillOrder(skill.display_order);
    setIsModalOpen(true);
  }

  async function handleSaveSkill(e: React.FormEvent) {
    e.preventDefault();
    if (!skillName.trim()) {
      toast.error("Nama keahlian wajib diisi");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: skillName.trim(),
        category: skillCategory,
        display_order: Number(skillOrder) || 0,
      };

      if (editingSkill) {
        const { error } = await supabase
          .from("skills")
          .update(payload)
          .eq("id", editingSkill.id);
        if (error) throw error;
        toast.success("Keahlian berhasil diperbarui");
      } else {
        const { error } = await supabase
          .from("skills")
          .insert(payload);
        if (error) throw error;
        toast.success("Keahlian baru berhasil ditambahkan");
      }

      await revalidateHomeAction();
      setIsModalOpen(false);
      fetchSkills();
    } catch (err: any) {
      toast.error("Gagal menyimpan: " + err.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteSkill() {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("skills")
        .delete()
        .eq("id", deleteTargetId);
      if (error) throw error;

      await revalidateHomeAction();
      toast.success("Keahlian berhasil dihapus");
      setDeleteTargetId(null);
      fetchSkills();
    } catch (err: any) {
      toast.error("Gagal menghapus: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  }

  const currentCategorySkills = skills.filter((s) => s.category === activeTab);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[--ink-12]">
        <div>
          <span className="eyebrow-label mb-2">Manajemen Konten</span>
          <h1 className="text-h1 font-[family-name:var(--font-fraunces)] text-[--ink]">
            Keahlian (Skills)
          </h1>
          <p className="text-small text-[--ink-70] mt-1">
            Kelola daftar keahlian yang dikelompokkan ke dalam 4 kategori utama.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openAddModal(activeTab)}
          className="btn-solid text-xs inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={14} weight="bold" />
          Tambah Keahlian
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-[--ink-12] gap-2 overflow-x-auto pb-px">
        {CATEGORIES.map(({ value, label }) => {
          const count = skills.filter((s) => s.category === value).length;
          const isActive = activeTab === value;
          return (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className={`
                px-4 py-3 text-xs font-[family-name:var(--font-geist-mono)] uppercase tracking-wider
                border-b-2 transition-all shrink-0 flex items-center gap-2
                ${
                  isActive
                    ? "border-[--ink] text-[--ink] font-bold"
                    : "border-transparent text-[--ink-45] hover:text-[--ink] hover:border-[--ink-12]"
                }
              `}
            >
              <span>{label}</span>
              <span className="px-1.5 py-0.5 rounded-full text-[0.625rem] bg-[--surface-alt] text-[--ink-70]">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content list for active category */}
      {isLoading ? (
        <div className="py-20 flex items-center justify-center text-[--ink-70] gap-2">
          <Spinner size={24} className="animate-spin" />
          <span className="text-sm font-[family-name:var(--font-geist-mono)]">Memuat keahlian...</span>
        </div>
      ) : currentCategorySkills.length === 0 ? (
        <div className="card p-12 text-center border-dashed space-y-3">
          <p className="text-sm text-[--ink-70]">
            Belum ada keahlian untuk kategori{" "}
            <strong>{CATEGORIES.find((c) => c.value === activeTab)?.label}</strong>.
          </p>
          <button
            type="button"
            onClick={() => openAddModal(activeTab)}
            className="btn-outline text-xs inline-flex items-center gap-1.5"
          >
            <Plus size={14} weight="bold" />
            Tambahkan Sekarang
          </button>
        </div>
      ) : (
        <div className="card divide-y divide-[--ink-12]">
          {currentCategorySkills.map((skill) => (
            <div
              key={skill.id}
              className="p-4 flex items-center justify-between gap-4 hover:bg-[--surface-alt]/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="chip bg-[--paper] font-medium text-[--ink]">
                  {skill.name}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-[family-name:var(--font-geist-mono)] text-[0.6875rem] text-[--ink-45]">
                  Urutan: {skill.display_order}
                </span>
                <button
                  type="button"
                  onClick={() => openEditModal(skill)}
                  className="p-1.5 text-[--ink-70] hover:text-[--ink] transition-colors"
                  aria-label="Edit keahlian"
                >
                  <PencilSimple size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTargetId(skill.id)}
                  className="p-1.5 text-red-600 hover:text-red-700 transition-colors"
                  aria-label="Hapus keahlian"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add / Edit Skill */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[--ink]/60 backdrop-blur-xs">
          <div className="w-full max-w-md card bg-[--paper] p-6 shadow-xl animate-in fade-in zoom-in-95">
            <h3 className="text-h2 font-[family-name:var(--font-fraunces)] text-[--ink] mb-4">
              {editingSkill ? "Edit Keahlian" : "Tambah Keahlian Baru"}
            </h3>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
                  Kategori *
                </label>
                <select
                  value={skillCategory}
                  onChange={(e) => setSkillCategory(e.target.value as SkillCategory)}
                  className="px-3 py-2 text-sm rounded-sm border border-[--ink-12] bg-[--paper] text-[--ink] focus-visible:outline-2 focus-visible:outline-[--ink]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
                  Nama Keahlian / Tool *
                </label>
                <input
                  type="text"
                  required
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="Contoh: Next.js, TypeScript, PostgreSQL"
                  className="px-3 py-2 text-sm rounded-sm border border-[--ink-12] bg-transparent text-[--ink] focus-visible:outline-2 focus-visible:outline-[--ink]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
                  Urutan Tampil (Display Order)
                </label>
                <input
                  type="number"
                  value={skillOrder}
                  onChange={(e) => setSkillOrder(Number(e.target.value))}
                  className="px-3 py-2 text-sm rounded-sm border border-[--ink-12] bg-transparent text-[--ink] focus-visible:outline-2 focus-visible:outline-[--ink]"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[--ink-12]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="btn-outline text-xs px-4 py-2"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-solid text-xs px-4 py-2 disabled:opacity-60"
                >
                  {isSaving ? "Menyimpan..." : "Simpan Keahlian"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Hapus Keahlian"
        message="Apakah Anda yakin ingin menghapus keahlian ini dari portfolio Anda?"
        isLoading={isDeleting}
        onConfirm={handleDeleteSkill}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
