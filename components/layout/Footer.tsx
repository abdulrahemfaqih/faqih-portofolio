import Link from "next/link";
import {
  LinkedinLogo,
  GithubLogo,
  InstagramLogo,
  XLogo,
  Globe,
  ArrowUp,
} from "@phosphor-icons/react/dist/ssr";
import type { SocialLink } from "@/types/supabase";

interface FooterProps {
  socialLinks: SocialLink[];
}

function getPlatformIcon(platform: string) {
  const size = 16;
  switch (platform.toLowerCase()) {
    case "linkedin": return <LinkedinLogo size={size} />;
    case "github":   return <GithubLogo size={size} />;
    case "instagram": return <InstagramLogo size={size} />;
    case "x":
    case "twitter":  return <XLogo size={size} />;
    default:         return <Globe size={size} />;
  }
}

export default function Footer({ socialLinks }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[--ink-12] py-8">
      <div className="container-main flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Copyright */}
        <p className="font-[family-name:var(--font-geist-mono)] text-xs text-[--ink-45] tracking-wide">
          © {year} Abdul Rahem Faqih. Dibuat dengan{" "}
          <span aria-label="semangat">↑</span> di Indonesia.
        </p>

        {/* Social links kecil */}
        {socialLinks.length > 0 && (
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.platform}
                className="text-[--ink-45] hover:text-[--ink] transition-colors duration-200"
              >
                {getPlatformIcon(link.platform)}
              </a>
            ))}
          </div>
        )}

        {/* Back to top */}
        <a
          href="#"
          className="
            flex items-center gap-1.5
            font-[family-name:var(--font-geist-mono)] text-xs text-[--ink-45]
            hover:text-[--ink] transition-colors duration-200
            tracking-wide uppercase
          "
          aria-label="Kembali ke atas halaman"
        >
          <ArrowUp size={12} weight="bold" />
          Atas
        </a>
      </div>
    </footer>
  );
}
