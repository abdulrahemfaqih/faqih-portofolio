"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { UploadSimple, Trash, Spinner } from "@phosphor-icons/react";
import { uploadFileToStorage } from "@/lib/supabase/storage";
import toast from "react-hot-toast";

interface ImageUploadProps {
  bucket: string;
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  aspectRatio?: "square" | "video" | "avatar";
  helperText?: string;
}

export default function ImageUpload({
  bucket,
  value,
  onChange,
  label = "Upload Gambar",
  aspectRatio = "video",
  helperText = "PNG, JPG, WEBP hingga 5MB",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectClasses = {
    square: "aspect-square max-w-[200px]",
    video: "aspect-[16/9] max-w-md",
    avatar: "aspect-square w-32 rounded-full",
  };

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar (maks 5MB)");
      return;
    }

    try {
      setIsUploading(true);
      const url = await uploadFileToStorage(file, bucket);
      onChange(url);
      toast.success("Gambar berhasil di-upload");
    } catch (err: any) {
      toast.error(err.message || "Gagal upload gambar");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove() {
    onChange(null);
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
          {label}
        </span>
      )}

      {value ? (
        <div className="relative group inline-block">
          <div
            className={`relative overflow-hidden border border-[--ink-12] bg-[--surface-alt] ${aspectClasses[aspectRatio]}`}
          >
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              sizes="300px"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Hapus gambar"
            className="absolute top-2 right-2 p-1.5 rounded-sm bg-red-600 text-white shadow-md hover:bg-red-700 transition-colors"
          >
            <Trash size={16} />
          </button>
        </div>
      ) : (
        <div>
          <button
            type="button"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
            className={`
              flex flex-col items-center justify-center p-6 border-2 border-dashed border-[--ink-12]
              rounded-sm bg-[--paper] hover:border-[--ink-45] transition-colors cursor-pointer w-full text-center
              ${aspectClasses[aspectRatio]}
            `}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2 text-[--ink-70]">
                <Spinner size={24} className="animate-spin" />
                <span className="text-xs">Mengupload...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-[--ink-70]">
                <UploadSimple size={24} className="text-[--ink-45]" />
                <span className="text-xs font-medium text-[--ink]">
                  Pilih atau seret gambar
                </span>
                {helperText && (
                  <span className="text-[0.6875rem] text-[--ink-45]">
                    {helperText}
                  </span>
                )}
              </div>
            )}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}
