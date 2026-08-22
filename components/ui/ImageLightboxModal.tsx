"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { X, CaretLeft, CaretRight } from "@phosphor-icons/react";

interface ImageLightboxModalProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function ImageLightboxModal({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  title,
}: ImageLightboxModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  // Keyboard navigation & Esc to close
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    }

    // Disable body scroll when modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#0a0a0a]/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Preview Foto"
    >
      {/* Container utama (mencegah klik pada gambar menutup modal) */}
      <div
        className="relative flex flex-col items-center max-w-5xl w-full max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar: Judul / Counter & Tombol Tutup */}
        <div className="w-full flex items-center justify-between pb-3 text-white/90">
          <div className="flex items-center gap-3">
            {title && (
              <span className="text-sm font-medium text-[#fafaf8] truncate max-w-xs sm:max-w-md">
                {title}
              </span>
            )}
            {images.length > 1 && (
              <span className="font-[family-name:var(--font-geist-mono)] text-xs tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10">
                {currentIndex + 1} / {images.length}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup preview"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Area Gambar Utama */}
        <div className="relative w-full h-[65vh] sm:h-[75vh] flex items-center justify-center rounded-sm overflow-hidden border border-white/10 bg-black/40">
          <Image
            src={currentImage}
            alt={title || `Foto ${currentIndex + 1}`}
            fill
            quality={85}
            className="object-contain select-none"
            sizes="(max-width: 1200px) 90vw, 1200px"
            priority
          />

          {/* Tombol Navigasi Kiri */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Foto sebelumnya"
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 transition-all hover:scale-105 cursor-pointer"
            >
              <CaretLeft size={22} weight="bold" />
            </button>
          )}

          {/* Tombol Navigasi Kanan */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Foto selanjutnya"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 transition-all hover:scale-105 cursor-pointer"
            >
              <CaretRight size={22} weight="bold" />
            </button>
          )}
        </div>

        {/* Thumbnail preview strip bawah jika ada banyak foto */}
        {images.length > 1 && (
          <div className="flex items-center gap-2 mt-3 overflow-x-auto max-w-full py-1 px-2">
            {images.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                className={`relative w-12 h-12 shrink-0 rounded-sm overflow-hidden border transition-all cursor-pointer ${
                  i === currentIndex
                    ? "border-white scale-105 ring-2 ring-white/30"
                    : "border-white/20 opacity-50 hover:opacity-100"
                }`}
              >
                <Image
                  src={url}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  quality={60}
                  className="object-cover"
                  sizes="48px"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
