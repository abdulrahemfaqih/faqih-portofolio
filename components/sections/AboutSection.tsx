import Image from "next/image";
import Link from "next/link";
import {
  LinkedinLogo,
  GithubLogo,
  InstagramLogo,
  XLogo,
  Globe,
  DownloadSimple,
} from "@phosphor-icons/react/dist/ssr";
import type { AboutMe, SocialLink } from "@/types/supabase";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface AboutSectionProps {
  about: AboutMe | null;
  socialLinks: SocialLink[];
}

function getPlatformIcon(platform: string) {
  const size = 20;
  const weight = "regular" as const;
  switch (platform.toLowerCase()) {
    case "linkedin": return <LinkedinLogo size={size} weight={weight} />;
    case "github":   return <GithubLogo size={size} weight={weight} />;
    case "instagram": return <InstagramLogo size={size} weight={weight} />;
    case "x":
    case "twitter":  return <XLogo size={size} weight={weight} />;
    default:         return <Globe size={size} weight={weight} />;
  }
}

function getPlatformLabel(platform: string): string {
  const map: Record<string, string> = {
    linkedin: "LinkedIn",
    github: "GitHub",
    instagram: "Instagram",
    x: "X",
    twitter: "Twitter",
  };
  return map[platform.toLowerCase()] ?? platform;
}

export default function AboutSection({ about, socialLinks }: AboutSectionProps) {
  return (
    <section id="about" className="section-spacing surface-alt">
      <div className="container-main">
        <ScrollReveal>
          <SectionHeader eyebrow="Tentang Saya" title="Siapa saya?" />
        </ScrollReveal>

        {/* Split layout 5/7 — asimetris (design.md §7) */}
        <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-8 md:gap-12 lg:gap-16 items-start">
          {/* Kiri: Foto */}
          <ScrollReveal delay={0.1}>
            <div className="relative max-w-xs sm:max-w-sm mx-auto md:mx-0 w-full">
              {/* Aksen garis dekoratif di belakang foto */}
              <div
                className="absolute inset-0 translate-x-3 translate-y-3 border border-[--ink-12] rounded-sm pointer-events-none"
                aria-hidden="true"
              />

              {/* Kontainer Foto Utama */}
              <div className="relative z-10 aspect-[4/5] w-full overflow-hidden rounded-sm border border-[--ink-12] bg-[--surface-alt]">
                <Image
                  src={about?.avatar_url ?? "/me.png"}
                  alt={`Foto ${about?.full_name ?? "Abdul Rahem Faqih"}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 384px"
                  className="object-cover object-top"
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Kanan: Teks + Social + CV */}
          <ScrollReveal delay={0.2}>
            <div className="flex flex-col gap-6">
              <h3 className="text-h2 font-[family-name:var(--font-fraunces)] text-[--ink]">
                {about?.full_name ?? "Abdul Rahem Faqih"}
              </h3>
              <p className="font-[family-name:var(--font-geist-mono)] text-sm tracking-wide text-[--ink-70] uppercase">
                {about?.role_title ?? "Fullstack Developer"}
              </p>

              <div className="text-body-lg text-[--ink-70] leading-relaxed space-y-4">
                {about?.bio ? (
                  about.bio.split("\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))
                ) : (
                  <p>
                    Fullstack Developer dengan fokus pada pengembangan aplikasi
                    web dan moile modern, dari antarmuka yang responsif hingga backend
                    yang solid. Saya peduli pada detail, performa, dan kode yang
                    mudah dipelihara.
                  </p>
                )}
              </div>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {socialLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Profil ${getPlatformLabel(link.platform)} saya`}
                      className="
                        flex items-center gap-2 px-3 py-2
                        border border-[--ink-12] rounded-sm
                        text-[--ink-70] text-sm
                        hover:border-[--ink] hover:text-[--ink]
                        transition-all duration-200
                      "
                    >
                      {getPlatformIcon(link.platform)}
                      <span className="font-[family-name:var(--font-geist-mono)] text-xs tracking-wide">
                        {getPlatformLabel(link.platform)}
                      </span>
                    </a>
                  ))}
                </div>
              )}

              {/* Tombol Download CV */}
              {about?.cv_url && (
                <div className="pt-2">
                  <a
                    href={about.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="btn-outline inline-flex items-center gap-2"
                  >
                    <DownloadSimple size={16} weight="bold" />
                    Unduh CV
                  </a>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
