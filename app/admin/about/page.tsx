"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AboutMe, SocialLink } from "@/types/supabase";
import ImageUpload from "@/components/admin/ImageUpload";
import FileUpload from "@/components/admin/FileUpload";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { Plus, Trash, PencilSimple, Spinner, Check } from "@phosphor-icons/react";
import toast from "react-hot-toast";

const PLATFORM_OPTIONS = [
  { value: "github", label: "GitHub" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "x", label: "X (Twitter)" },
  { value: "youtube", label: "YouTube" },
  { value: "dribbble", label: "Dribbble" },
  { value: "other", label: "Lainnya" },
];

export default function AdminAboutPage() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingAbout, setIsSavingAbout] = useState(false);

  // About Me state
  const [aboutId, setAboutId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");

  // Social Links state
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [socialPlatform, setSocialPlatform] = useState("github");
  const [socialUrl, setSocialUrl] = useState("");
  const [socialOrder, setSocialOrder] = useState(0);
  const [isSavingSocial, setIsSavingSocial] = useState(false);

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      // Fetch about_me
      const { data: aboutData, error: aboutError } = await supabase
        .from("about_me")
        .select("*")
        .maybeSingle();

      if (aboutError) throw aboutError;

      if (aboutData) {
        setAboutId(aboutData.id);
        setFullName(aboutData.full_name || "");
        setRoleTitle(aboutData.role_title || "");
        setHeadline(aboutData.headline || "");
        setBio(aboutData.bio || "");
        setAvatarUrl(aboutData.avatar_url || null);
        setCvUrl(aboutData.cv_url || null);
        setEmail(aboutData.email || "");
        setLocation(aboutData.location || "");
      }

      // Fetch social_links
      const { data: socialData, error: socialError } = await supabase
        .from("social_links")
        .select("*")
        .order("display_order", { ascending: true });

      if (socialError) throw socialError;
      setSocialLinks(socialData || []);
    } catch (err: any) {
      toast.error("Gagal memuat data: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSaveAbout(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !roleTitle.trim()) {
      toast.error("Nama Lengkap dan Judul Peran wajib diisi");
      return;
    }

    setIsSavingAbout(true);
    try {
      const payload = {
        full_name: fullName.trim(),
        role_title: roleTitle.trim(),
        headline: headline.trim() || null,
        bio: bio.trim() || null,
        avatar_url: avatarUrl,
        cv_url: cvUrl,
        email: email.trim() || null,
        location: location.trim() || null,
      };

      if (aboutId) {
        const { error } = await supabase
          .from("about_me")
          .update(payload)
          .eq("id", aboutId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("about_me")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw error;
        if (data) setAboutId(data.id);
      }

      toast.success("Profil About Me berhasil disimpan!");
    } catch (err: any) {
      toast.error("Gagal menyimpan: " + err.message);
    } finally {
      setIsSavingAbout(false);
    }
  }

  function openAddSocialModal() {
    setEditingSocial(null);
    setSocialPlatform("github");
    setSocialUrl("");
    setSocialOrder(socialLinks.length);
    setIsSocialModalOpen(true);
  }

  function openEditSocialModal(link: SocialLink) {
    setEditingSocial(link);
    setSocialPlatform(link.platform);
    setSocialUrl(link.url);
    setSocialOrder(link.display_order);
    setIsSocialModalOpen(true);
  }

  async function handleSaveSocial(e: React.FormEvent) {
    e.preventDefault();
    if (!socialUrl.trim()) {
      toast.error("URL social link wajib diisi");
      return;
    }

    setIsSavingSocial(true);
    try {
      const payload = {
        platform: socialPlatform.trim().toLowerCase(),
        url: socialUrl.trim(),
        display_order: Number(socialOrder) || 0,
      };

      if (editingSocial) {
        const { error } = await supabase
          .from("social_links")
          .update(payload)
          .eq("id", editingSocial.id);
        if (error) throw error;
        toast.success("Social link diperbarui");
      } else {
        const { error } = await supabase
          .from("social_links")
          .insert(payload);
        if (error) throw error;
        toast.success("Social link ditambahkan");
      }

      setIsSocialModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error("Gagal menyimpan social link: " + err.message);
    } finally {
      setIsSavingSocial(false);
    }
  }

  async function handleDeleteSocial() {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("social_links")
        .delete()
        .eq("id", deleteTargetId);
      if (error) throw error;

      toast.success("Social link berhasil dihapus");
      setDeleteTargetId(null);
      fetchData();
    } catch (err: any) {
      toast.error("Gagal menghapus: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="py-20 flex items-center justify-center text-[--ink-70] gap-2">
        <Spinner size={24} className="animate-spin" />
        <span className="text-sm font-[family-name:var(--font-geist-mono)]">Memuat profil...</span>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <div className="pb-6 border-b border-[--ink-12]">
        <span className="eyebrow-label mb-2">Manajemen Konten</span>
        <h1 className="text-h1 font-[family-name:var(--font-fraunces)] text-[--ink]">
          About Me & Social Links
        </h1>
        <p className="text-small text-[--ink-70] mt-1">
          Perbarui informasi biodata, headline hero, foto profil, file CV, dan link media sosial Anda.
        </p>
      </div>

      {/* Form About Me */}
      <form onSubmit={handleSaveAbout} className="card p-6 md:p-8 space-y-6">
        <h2 className="text-h2 font-[family-name:var(--font-fraunces)] text-[--ink] pb-3 border-b border-[--ink-12]">
          Profil Utama
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
              Nama Lengkap *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Contoh: Abdul Rahem Faqih"
              className="px-3 py-2.5 rounded-sm border border-[--ink-12] bg-transparent text-[--ink] text-sm focus-visible:outline-2 focus-visible:outline-[--ink] focus-visible:outline-offset-2"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
              Peran / Role Title *
            </label>
            <input
              type="text"
              required
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="Contoh: Fullstack Developer"
              className="px-3 py-2.5 rounded-sm border border-[--ink-12] bg-transparent text-[--ink] text-sm focus-visible:outline-2 focus-visible:outline-[--ink] focus-visible:outline-offset-2"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
            Headline (Hero Section)
          </label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Contoh: Membangun aplikasi web modern — dari antarmuka ke infrastruktur."
            className="px-3 py-2.5 rounded-sm border border-[--ink-12] bg-transparent text-[--ink] text-sm focus-visible:outline-2 focus-visible:outline-[--ink] focus-visible:outline-offset-2"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
            Bio Lengkap (About Me Section)
          </label>
          <textarea
            rows={5}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tuliskan cerita singkat, latar belakang, dan keahlian Anda..."
            className="px-3 py-2.5 rounded-sm border border-[--ink-12] bg-transparent text-[--ink] text-sm focus-visible:outline-2 focus-visible:outline-[--ink] focus-visible:outline-offset-2 resize-y"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
              Email Kontak
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="px-3 py-2.5 rounded-sm border border-[--ink-12] bg-transparent text-[--ink] text-sm focus-visible:outline-2 focus-visible:outline-[--ink] focus-visible:outline-offset-2"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
              Lokasi Domisili
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Indonesia"
              className="px-3 py-2.5 rounded-sm border border-[--ink-12] bg-transparent text-[--ink] text-sm focus-visible:outline-2 focus-visible:outline-[--ink] focus-visible:outline-offset-2"
            />
          </div>
        </div>

        {/* Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[--ink-12]">
          <ImageUpload
            bucket="avatars"
            value={avatarUrl}
            onChange={setAvatarUrl}
            label="Foto Profil (Avatar)"
            aspectRatio="square"
            helperText="Foto ini tampil di hero/about section"
          />

          <FileUpload
            bucket="cv"
            value={cvUrl}
            onChange={setCvUrl}
            label="File CV (PDF)"
            helperText="File PDF yang dapat diunduh pengunjung"
          />
        </div>

        {/* Submit button */}
        <div className="pt-4 border-t border-[--ink-12] flex justify-end">
          <button
            type="submit"
            disabled={isSavingAbout}
            className="btn-solid text-xs px-6 py-2.5 disabled:opacity-60 inline-flex items-center gap-2"
          >
            {isSavingAbout ? (
              <>
                <Spinner size={16} className="animate-spin" />
                Menyimpan Profil...
              </>
            ) : (
              <>
                <Check size={16} weight="bold" />
                Simpan Profil About Me
              </>
            )}
          </button>
        </div>
      </form>

      {/* Section Social Links */}
      <div className="card p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[--ink-12]">
          <div>
            <h2 className="text-h2 font-[family-name:var(--font-fraunces)] text-[--ink]">
              Social Media Links
            </h2>
            <p className="text-small text-[--ink-45]">
              Daftar link sosial yang tampil di About Me, Kontak, dan Footer.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddSocialModal}
            className="btn-solid text-xs inline-flex items-center gap-1.5"
          >
            <Plus size={14} weight="bold" />
            Tambah Link
          </button>
        </div>

        {socialLinks.length === 0 ? (
          <p className="py-8 text-center text-sm text-[--ink-45] border border-dashed border-[--ink-12] rounded-sm">
            Belum ada link sosial media. Tambahkan link pertama Anda.
          </p>
        ) : (
          <div className="divide-y divide-[--ink-12]">
            {socialLinks.map((link) => (
              <div key={link.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-[family-name:var(--font-geist-mono)] text-xs tracking-wider uppercase font-semibold text-[--ink]">
                    {link.platform}
                  </p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[--ink-70] hover:text-[--ink] underline truncate block mt-0.5"
                  >
                    {link.url}
                  </a>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-[family-name:var(--font-geist-mono)] text-[0.6875rem] text-[--ink-45] px-2 py-1 bg-[--surface-alt] rounded-sm">
                    Urutan: {link.display_order}
                  </span>
                  <button
                    type="button"
                    onClick={() => openEditSocialModal(link)}
                    className="p-1.5 text-[--ink-70] hover:text-[--ink] transition-colors"
                    aria-label="Edit link"
                  >
                    <PencilSimple size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTargetId(link.id)}
                    className="p-1.5 text-red-600 hover:text-red-700 transition-colors"
                    aria-label="Hapus link"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Add / Edit Social Link */}
      {isSocialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[--ink]/60 backdrop-blur-xs">
          <div className="w-full max-w-md card bg-[--paper] p-6 shadow-xl animate-in fade-in zoom-in-95">
            <h3 className="text-h2 font-[family-name:var(--font-fraunces)] text-[--ink] mb-4">
              {editingSocial ? "Edit Social Link" : "Tambah Social Link"}
            </h3>

            <form onSubmit={handleSaveSocial} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
                  Platform
                </label>
                <select
                  value={socialPlatform}
                  onChange={(e) => setSocialPlatform(e.target.value)}
                  className="px-3 py-2 text-sm rounded-sm border border-[--ink-12] bg-[--paper] text-[--ink] focus-visible:outline-2 focus-visible:outline-[--ink]"
                >
                  {PLATFORM_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
                  URL Link *
                </label>
                <input
                  type="url"
                  required
                  value={socialUrl}
                  onChange={(e) => setSocialUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="px-3 py-2 text-sm rounded-sm border border-[--ink-12] bg-transparent text-[--ink] focus-visible:outline-2 focus-visible:outline-[--ink]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
                  Urutan Tampil (Display Order)
                </label>
                <input
                  type="number"
                  value={socialOrder}
                  onChange={(e) => setSocialOrder(Number(e.target.value))}
                  className="px-3 py-2 text-sm rounded-sm border border-[--ink-12] bg-transparent text-[--ink] focus-visible:outline-2 focus-visible:outline-[--ink]"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[--ink-12]">
                <button
                  type="button"
                  onClick={() => setIsSocialModalOpen(false)}
                  disabled={isSavingSocial}
                  className="btn-outline text-xs px-4 py-2"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingSocial}
                  className="btn-solid text-xs px-4 py-2 disabled:opacity-60"
                >
                  {isSavingSocial ? "Menyimpan..." : "Simpan Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Hapus Social Link"
        message="Apakah Anda yakin ingin menghapus social link ini? Link ini tidak akan tampil lagi di website."
        isLoading={isDeleting}
        onConfirm={handleDeleteSocial}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
