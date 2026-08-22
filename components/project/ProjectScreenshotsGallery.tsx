"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { MagnifyingGlassPlus, Images } from "@phosphor-icons/react";

const ImageLightboxModal = dynamic(
  () => import("@/components/ui/ImageLightboxModal"),
  { ssr: false }
);

interface ProjectScreenshotsGalleryProps {
  screenshots: string[];
  projectTitle: string;
}

export default function ProjectScreenshotsGallery({
  screenshots,
  projectTitle,
}: ProjectScreenshotsGalleryProps) {
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  if (!screenshots || screenshots.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-[--ink-12]">
      {/* Header Galeri */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Images size={18} className="text-[--ink-70]" />
          <h2 className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.1em] uppercase text-[--ink-70] font-semibold">
            Screenshot & Tampilan Proyek ({screenshots.length})
          </h2>
        </div>
        <span className="font-[family-name:var(--font-geist-mono)] text-[0.6875rem] text-[--ink-45]">
          Klik untuk memperbesar
        </span>
      </div>

      {/* Grid Screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {screenshots.map((url, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveLightboxIndex(idx)}
            className="group relative aspect-[16/10] w-full rounded-sm overflow-hidden border border-[--ink-12] bg-[--surface-alt] hover:border-[--ink-45] transition-all cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-[--ink]"
            aria-label={`Lihat screenshot ${idx + 1} proyek ${projectTitle}`}
          >
            <Image
              src={url}
              alt={`Screenshot ${idx + 1} - ${projectTitle}`}
              fill
              quality={75}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
              loading="lazy"
            />
            {/* Hover overlay dengan icon pembesar */}
            <div className="absolute inset-0 bg-[--ink]/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="p-2.5 rounded-full bg-[--paper]/90 text-[--ink] shadow-sm transform scale-90 group-hover:scale-100 transition-transform">
                <MagnifyingGlassPlus size={18} weight="bold" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Pop-up Modal */}
      {activeLightboxIndex !== null && (
        <ImageLightboxModal
          isOpen={activeLightboxIndex !== null}
          images={screenshots}
          initialIndex={activeLightboxIndex}
          title={`${projectTitle} — Screenshot`}
          onClose={() => setActiveLightboxIndex(null)}
        />
      )}
    </div>
  );
}
