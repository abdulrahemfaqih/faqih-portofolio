import {
  LinkedinLogo,
  GithubLogo,
  InstagramLogo,
  XLogo,
  Globe,
  EnvelopeSimple,
} from "@phosphor-icons/react/dist/ssr";
import type { AboutMe, SocialLink } from "@/types/supabase";
import ContactForm from "@/components/ui/ContactForm";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Toaster } from "react-hot-toast";

interface ContactSectionProps {
  about: AboutMe | null;
  socialLinks: SocialLink[];
}

function getPlatformIcon(platform: string) {
  const size = 22;
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
    x: "X (Twitter)",
    twitter: "Twitter",
  };
  return map[platform.toLowerCase()] ?? platform;
}

export default function ContactSection({ about, socialLinks }: ContactSectionProps) {
  return (
    <section id="contact" className="section-spacing surface-alt">
      {/* Toaster untuk notifikasi form — letakkan di sini agar tersedia */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--ink)",
            color: "var(--paper)",
            fontFamily: "var(--font-geist-sans)",
            fontSize: "0.875rem",
            borderRadius: "4px",
          },
        }}
      />

      <div className="container-main">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Kontak"
            title="Mari berkolaborasi"
          />
        </ScrollReveal>

        {/* Layout tidak simetris: headline kiri, form kanan (design.md §7) */}
        <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-8 md:gap-12 lg:gap-16">
          {/* Kiri: Ajakan + kontak langsung */}
          <ScrollReveal delay={0.1}>
            <div className="flex flex-col gap-8">
              <p className="text-body-lg text-[--ink-70] leading-relaxed">
                Hubungi saya langsung lewat email, LinkedIn, atau GitHub. Saya
                terbuka untuk kolaborasi freelance maupun kesempatan full-time.
              </p>

              <div className="flex flex-col gap-4">
                {/* Email langsung */}
                {about?.email && (
                  <a
                    href={`mailto:${about.email}`}
                    className="
                      flex items-center gap-3 py-3 px-4
                      border border-[--ink-12] rounded-sm
                      text-[--ink-70] hover:text-[--ink] hover:border-[--ink]
                      transition-all duration-200 group
                    "
                  >
                    <EnvelopeSimple size={22} weight="regular" className="shrink-0" />
                    <div>
                      <p className="font-[family-name:var(--font-geist-mono)] text-xs tracking-wide uppercase text-[--ink-45] mb-0.5">
                        Email
                      </p>
                      <p className="text-small">{about.email}</p>
                    </div>
                  </a>
                )}

                {/* Social links */}
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex items-center gap-3 py-3 px-4
                      border border-[--ink-12] rounded-sm
                      text-[--ink-70] hover:text-[--ink] hover:border-[--ink]
                      transition-all duration-200
                    "
                  >
                    {getPlatformIcon(link.platform)}
                    <div>
                      <p className="font-[family-name:var(--font-geist-mono)] text-xs tracking-wide uppercase text-[--ink-45] mb-0.5">
                        {getPlatformLabel(link.platform)}
                      </p>
                      <p className="text-small truncate max-w-[200px]">
                        {link.url.replace(/^https?:\/\/(www\.)?/, "")}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Kanan: Form kontak */}
          <ScrollReveal delay={0.2}>
            <ContactForm />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
