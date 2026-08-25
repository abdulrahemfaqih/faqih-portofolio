/**
 * SectionHeader — Label eyebrow + judul section + divider garis
 * Komponen ini Server Component (tidak butuh "use client")
 * Dipakai di setiap section untuk konsistensi visual
 */

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="mb-8 sm:mb-10 md:mb-12">
      <div className="eyebrow-label mb-3 sm:mb-4">{eyebrow}</div>
      <h2 className="text-h1 font-[family-name:var(--font-fraunces)] text-[--ink]">
        {title}
      </h2>
      {description && (
        <p className="mt-3 sm:mt-4 text-base sm:text-body-lg text-[--ink-70] max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
