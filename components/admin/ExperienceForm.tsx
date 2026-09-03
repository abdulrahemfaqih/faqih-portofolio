"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Experience, EmploymentType } from "@/types/supabase";
import ImageUpload from "./ImageUpload";
import MultiImageUpload from "./MultiImageUpload";
import BulletPointsInput from "./BulletPointsInput";
import { ArrowLeft, Spinner, Check } from "@phosphor-icons/react";
import toast from "react-hot-toast";
import { revalidateHomeAction } from "@/app/actions/revalidate";

const MONTHS = [
  { value: 1, label: "Januari" },
  { value: 2, label: "Februari" },
  { value: 3, label: "Maret" },
  { value: 4, label: "April" },
  { value: 5, label: "Mei" },
  { value: 6, label: "Juni" },
  { value: 7, label: "Juli" },
  { value: 8, label: "Agustus" },
  { value: 9, label: "September" },
  { value: 10, label: "Oktober" },
  { value: 11, label: "November" },
  { value: 12, label: "Desember" },
];

const EMPLOYMENT_TYPE_OPTIONS: { value: EmploymentType; label: string }[] = [
  { value: "full_time", label: "Penuh Waktu (Full-time)" },
  { value: "part_time", label: "Paruh Waktu (Part-time)" },
  { value: "internship", label: "Magang (Internship)" },
  { value: "contract", label: "Kontrak (Contract)" },
  { value: "freelance", label: "Lepas (Freelance)" },
];

interface ExperienceFormProps {
  initialData?: Experience | null;
}

export default function ExperienceForm({ initialData }: ExperienceFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!initialData;

  const currentYear = new Date().getFullYear();

  const [companyName, setCompanyName] = useState(initialData?.company_name || "");
  const [positionTitle, setPositionTitle] = useState(initialData?.position_title || "");
  const [employmentType, setEmploymentType] = useState<EmploymentType | "">(
    initialData?.employment_type || ""
  );
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(
    initialData?.company_logo_url || null
  );
  const [photos, setPhotos] = useState<string[]>(initialData?.photos || []);
  const [startMonth, setStartMonth] = useState<number>(initialData?.start_month || 1);
  const [startYear, setStartYear] = useState<number>(initialData?.start_year || currentYear);
  const [endMonth, setEndMonth] = useState<number | null>(initialData?.end_month || null);
  const [endYear, setEndYear] = useState<number | null>(initialData?.end_year || null);
  const [isCurrent, setIsCurrent] = useState<boolean>(initialData?.is_current || false);
  const [descriptionPoints, setDescriptionPoints] = useState<string[]>(
    initialData?.description_points || []
  );
  const [displayOrder, setDisplayOrder] = useState<number>(initialData?.display_order || 0);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!companyName.trim() || !positionTitle.trim()) {
      toast.error("Nama Perusahaan dan Posisi Jabatan wajib diisi");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        company_name: companyName.trim(),
        position_title: positionTitle.trim(),
        employment_type: employmentType ? (employmentType as EmploymentType) : null,
        company_logo_url: companyLogoUrl,
        photos: photos,
        start_month: Number(startMonth),
        start_year: Number(startYear),
        end_month: isCurrent ? null : endMonth ? Number(endMonth) : null,
        end_year: isCurrent ? null : endYear ? Number(endYear) : null,
        is_current: Boolean(isCurrent),
        description_points: descriptionPoints,
        display_order: Number(displayOrder) || 0,
      };

      if (isEdit && initialData) {
        const { error } = await supabase
          .from("experience")
          .update(payload)
          .eq("id", initialData.id);
        if (error) throw error;
        toast.success("Pengalaman kerja berhasil diperbarui");
      } else {
        const { error } = await supabase.from("experience").insert(payload);
        if (error) throw error;
        toast.success("Pengalaman kerja berhasil ditambahkan");
      }

      await revalidateHomeAction();
      router.push("/admin/experience");
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
        href="/admin/experience"
        className="inline-flex items-center gap-2 font-[family-name:var(--font-geist-mono)] text-xs tracking-wide uppercase text-[--ink-45] hover:text-[--ink] transition-colors"
      >
        <ArrowLeft size={14} weight="bold" />
        Kembali ke Daftar Pengalaman
      </Link>

      <div className="pb-4 border-b border-[--ink-12]">
        <h1 className="text-h1 font-[family-name:var(--font-fraunces)] text-[--ink]">
          {isEdit ? "Edit Pengalaman Kerja" : "Tambah Pengalaman Kerja"}
        </h1>
        <p className="text-small text-[--ink-70] mt-1">
          {isEdit
            ? `Mengubah riwayat kerja di ${initialData.company_name}`
            : "Tambahkan riwayat karir, posisi, dan tanggung jawab pekerjaan Anda."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1.5 md:col-span-1">
            <label className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
              Nama Perusahaan / Instansi *
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Contoh: PT Teknologi Maju"
              className="px-3 py-2.5 rounded-sm border border-[--ink-12] bg-transparent text-[--ink] text-sm focus-visible:outline-2 focus-visible:outline-[--ink]"
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-1">
            <label className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
              Posisi / Jabatan *
            </label>
            <input
              type="text"
              required
              value={positionTitle}
              onChange={(e) => setPositionTitle(e.target.value)}
              placeholder="Contoh: Senior Frontend Engineer"
              className="px-3 py-2.5 rounded-sm border border-[--ink-12] bg-transparent text-[--ink] text-sm focus-visible:outline-2 focus-visible:outline-[--ink]"
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-1">
            <label className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
              Tipe Pekerjaan
            </label>
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value as EmploymentType | "")}
              className="px-3 py-2.5 rounded-sm border border-[--ink-12] bg-[--paper] text-[--ink] text-sm focus-visible:outline-2 focus-visible:outline-[--ink]"
            >
              <option value="">-- Pilih Tipe (Opsional) --</option>
              {EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Logo upload */}
        <div className="pt-2">
          <ImageUpload
            bucket="company-logos"
            value={companyLogoUrl}
            onChange={setCompanyLogoUrl}
            label="Logo Perusahaan"
            aspectRatio="square"
            helperText="Logo akan tampil di lingkaran timeline"
          />
        </div>

        {/* Periode waktu */}
        <div className="space-y-4 pt-4 border-t border-[--ink-12]">
          <h3 className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.08em] uppercase text-[--ink] font-semibold">
            Periode Kerja
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Start date */}
            <div className="space-y-2">
              <label className="text-xs text-[--ink-70]">Mulai Bekerja *</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={startMonth}
                  onChange={(e) => setStartMonth(Number(e.target.value))}
                  className="px-2.5 py-2 text-xs rounded-sm border border-[--ink-12] bg-[--paper] text-[--ink]"
                >
                  {MONTHS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  required
                  min={1990}
                  max={2099}
                  value={startYear}
                  onChange={(e) => setStartYear(Number(e.target.value))}
                  placeholder="Tahun"
                  className="px-2.5 py-2 text-xs rounded-sm border border-[--ink-12] bg-transparent text-[--ink]"
                />
              </div>
            </div>

            {/* End date / is current */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-[--ink-70]">Selesai Bekerja</label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCurrent}
                    onChange={(e) => setIsCurrent(e.target.checked)}
                    className="accent-[--ink]"
                  />
                  <span className="text-[0.6875rem] font-[family-name:var(--font-geist-mono)] text-[--ink-70]">
                    Masih Bekerja
                  </span>
                </label>
              </div>

              {!isCurrent && (
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={endMonth || 1}
                    onChange={(e) => setEndMonth(Number(e.target.value))}
                    className="px-2.5 py-2 text-xs rounded-sm border border-[--ink-12] bg-[--paper] text-[--ink]"
                  >
                    {MONTHS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1990}
                    max={2099}
                    value={endYear || currentYear}
                    onChange={(e) => setEndYear(Number(e.target.value))}
                    placeholder="Tahun"
                    className="px-2.5 py-2 text-xs rounded-sm border border-[--ink-12] bg-transparent text-[--ink]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bullet points deskripsi */}
        <div className="pt-4 border-t border-[--ink-12]">
          <BulletPointsInput
            value={descriptionPoints}
            onChange={setDescriptionPoints}
            label="Poin Tanggung Jawab & Pencapaian (Bullet Points)"
          />
        </div>

        {/* Foto Dokumentasi / Bukti Kegiatan */}
        <div className="pt-4 border-t border-[--ink-12]">
          <MultiImageUpload
            values={photos}
            onChange={setPhotos}
            label="Foto Dokumentasi / Sertifikat / Bukti Kegiatan"
            helperText="Upload foto dokumentasi kegiatan, sertifikat, atau bukti kerja (maks 10 foto, maks 5MB/foto)."
          />
        </div>

        {/* Display order */}
        <div className="pt-4 border-t border-[--ink-12] flex flex-col gap-1.5 max-w-xs">
          <label className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
            Urutan Tampil (Display Order)
          </label>
          <input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
            className="px-3 py-2 text-sm rounded-sm border border-[--ink-12] bg-transparent text-[--ink]"
          />
          <span className="text-[0.6875rem] text-[--ink-45]">
            Urutan kecil akan diprioritaskan
          </span>
        </div>

        {/* Buttons */}
        <div className="pt-6 border-t border-[--ink-12] flex items-center justify-end gap-3">
          <Link href="/admin/experience" className="btn-outline text-xs px-4 py-2.5">
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
                {isEdit ? "Simpan Perubahan" : "Simpan Pengalaman"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
