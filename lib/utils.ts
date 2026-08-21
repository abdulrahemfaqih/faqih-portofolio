/**
 * Utility helpers — dipakai di server dan client
 */

/**
 * Mengubah string menjadi slug URL-friendly.
 * Contoh: "Proyek Keren Ku!" → "proyek-keren-ku"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // hapus diacritic
    .replace(/[^a-z0-9\s-]/g, "")   // hapus karakter spesial
    .trim()
    .replace(/\s+/g, "-")            // spasi → tanda hubung
    .replace(/-+/g, "-");            // hapus tanda hubung berlebih
}

const MONTH_NAMES_ID = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

/**
 * Format rentang waktu pengalaman kerja dalam Bahasa Indonesia.
 * Contoh output: "Mar 2023 – Des 2023" atau "Jan 2024 – Sekarang"
 */
export function formatExperiencePeriod({
  start_month,
  start_year,
  end_month,
  end_year,
  is_current,
}: {
  start_month: number;
  start_year: number;
  end_month: number | null;
  end_year: number | null;
  is_current: boolean;
}): string {
  const startLabel = `${MONTH_NAMES_ID[start_month - 1]} ${start_year}`;

  if (is_current) {
    return `${startLabel} – Sekarang`;
  }

  if (end_month && end_year) {
    const endLabel = `${MONTH_NAMES_ID[end_month - 1]} ${end_year}`;
    return `${startLabel} – ${endLabel}`;
  }

  return startLabel;
}

/**
 * Format tanggal publish blog dalam Bahasa Indonesia.
 * Contoh: "21 Agustus 2026"
 */
export function formatPublishedDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Truncate teks panjang dengan ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Mapping nama platform social media ke label yang ditampilkan di UI.
 */
export const SOCIAL_PLATFORM_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  instagram: "Instagram",
  x: "X (Twitter)",
  twitter: "Twitter",
  youtube: "YouTube",
  dribbble: "Dribbble",
  email: "Email",
};

export function getSocialLabel(platform: string): string {
  return SOCIAL_PLATFORM_LABELS[platform.toLowerCase()] ?? platform;
}
