"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Trash, Spinner, Plus } from "@phosphor-icons/react";
import { uploadFileToStorage } from "@/lib/supabase/storage";
import toast from "react-hot-toast";

interface MultiImageUploadProps {
  bucket?: string;
  folder?: string;
  values: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  helperText?: string;
  maxFiles?: number;
}

export default function MultiImageUpload({
  bucket = "project-images",
  folder = "experience-photos",
  values = [],
  onChange,
  label = "Foto Dokumentasi / Sertifikat",
  helperText = "PNG, JPG, WEBP hingga 5MB per foto. Bisa pilih lebih dari satu.",
  maxFiles = 10,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (values.length + files.length > maxFiles) {
      toast.error(`Maksimal ${maxFiles} foto diperbolehkan.`);
      return;
    }

    // Filter file size
    const validFiles = files.filter((f) => {
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`File ${f.name} terlalu besar (maks 5MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    try {
      setIsUploading(true);
      const uploadPromises = validFiles.map((file) =>
        uploadFileToStorage(file, bucket, folder)
      );
      const newUrls = await Promise.all(uploadPromises);
      onChange([...values, ...newUrls]);
      toast.success(`${newUrls.length} foto berhasil di-upload`);
    } catch (err: any) {
      toast.error(err.message || "Gagal mengupload beberapa foto");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
          {label}
        </span>
      )}

      {/* Grid Thumbnail Foto */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {values.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="relative group aspect-[4/3] rounded-sm overflow-hidden border border-[--ink-12] bg-[--surface-alt]"
          >
            <Image
              src={url}
              alt={`Dokumentasi ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            />
            {/* Overlay gradient & tombol hapus */}
            <div className="absolute inset-0 bg-[--ink]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2">
              <button
                type="button"
                onClick={() => handleRemove(index)}
                aria-label={`Hapus foto ${index + 1}`}
                className="p-1.5 rounded-sm bg-red-600 text-white shadow-md hover:bg-red-700 transition-colors"
              >
                <Trash size={14} weight="bold" />
              </button>
            </div>
          </div>
        ))}

        {/* Tile Tambah Foto */}
        {values.length < maxFiles && (
          <button
            type="button"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
            className="
              aspect-[4/3] flex flex-col items-center justify-center p-3 border-2 border-dashed border-[--ink-12]
              rounded-sm bg-[--paper] hover:border-[--ink-45] hover:bg-[--surface-alt]/50 transition-colors cursor-pointer text-center
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-1.5 text-[--ink-70]">
                <Spinner size={20} className="animate-spin" />
                <span className="text-[0.6875rem] font-[family-name:var(--font-geist-mono)]">Mengupload...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 text-[--ink-70]">
                <Plus size={20} className="text-[--ink-45]" />
                <span className="text-xs font-medium text-[--ink]">
                  Tambah Foto
                </span>
                <span className="text-[0.625rem] text-[--ink-45]">
                  ({values.length}/{maxFiles})
                </span>
              </div>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      {helperText && (
        <span className="text-[0.6875rem] text-[--ink-45]">
          {helperText}
        </span>
      )}
    </div>
  );
}
