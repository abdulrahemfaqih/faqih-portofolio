"use client";

import { useState, useRef } from "react";
import { FilePdf, UploadSimple, Trash, Spinner, ArrowUpRight } from "@phosphor-icons/react";
import { uploadFileToStorage } from "@/lib/supabase/storage";
import toast from "react-hot-toast";

interface FileUploadProps {
  bucket: string;
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  helperText?: string;
  accept?: string;
}

export default function FileUpload({
  bucket,
  value,
  onChange,
  label = "Upload File CV (PDF)",
  helperText = "Format PDF hingga 10MB",
  accept = "application/pdf",
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar (maks 10MB)");
      return;
    }

    try {
      setIsUploading(true);
      const url = await uploadFileToStorage(file, bucket);
      onChange(url);
      toast.success("File berhasil di-upload");
    } catch (err: any) {
      toast.error(err.message || "Gagal upload file");
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
        <div className="flex items-center justify-between p-3 border border-[--ink-12] rounded-sm bg-[--surface-alt] max-w-md">
          <div className="flex items-center gap-3 min-w-0">
            <FilePdf size={24} className="text-[--ink] shrink-0" />
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[--ink] underline truncate hover:text-[--ink-70] flex items-center gap-1"
            >
              Lihat File Terpasang
              <ArrowUpRight size={12} />
            </a>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Hapus file"
            className="p-1.5 text-red-600 hover:text-red-700 transition-colors"
          >
            <Trash size={16} />
          </button>
        </div>
      ) : (
        <div className="max-w-md">
          <button
            type="button"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
            className="
              flex items-center justify-center gap-3 p-4 border-2 border-dashed border-[--ink-12]
              rounded-sm bg-[--paper] hover:border-[--ink-45] transition-colors cursor-pointer w-full
            "
          >
            {isUploading ? (
              <div className="flex items-center gap-2 text-[--ink-70]">
                <Spinner size={20} className="animate-spin" />
                <span className="text-xs">Mengupload...</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-[--ink-70]">
                <UploadSimple size={20} className="text-[--ink-45]" />
                <div className="text-left">
                  <p className="text-xs font-medium text-[--ink]">Pilih File Dokumen</p>
                  {helperText && (
                    <p className="text-[0.6875rem] text-[--ink-45]">{helperText}</p>
                  )}
                </div>
              </div>
            )}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}
