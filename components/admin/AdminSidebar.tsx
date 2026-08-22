"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SquaresFour,
  User,
  Code,
  Briefcase,
  Folder,
  Article,
  ArrowSquareOut,
  SignOut,
  X,
} from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: SquaresFour },
  { href: "/admin/about", label: "About & Profil", icon: User },
  { href: "/admin/skills", label: "Keahlian", icon: Code },
  { href: "/admin/experience", label: "Pengalaman", icon: Briefcase },
  { href: "/admin/projects", label: "Proyek", icon: Folder },
  { href: "/admin/blog", label: "Blog", icon: Article },
];

export default function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      toast.success("Berhasil keluar");
      router.push("/admin/login");
      router.refresh();
    } catch (err: any) {
      toast.error("Gagal logout: " + err.message);
    }
  }

  return (
    <aside className="w-full h-full min-h-full flex flex-col justify-between bg-[#fafaf8] bg-[--paper] border-r border-[--ink-12] p-5">
      <div>
        {/* Header / Brand */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[--ink-12]">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-[family-name:var(--font-fraunces)] font-bold text-lg text-[--ink]">
              Portfolio Admin
            </span>
          </Link>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1 text-[--ink-70] hover:text-[--ink]"
              aria-label="Tutup menu"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1.5" aria-label="Navigasi Admin">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                onClick={onCloseMobile}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-medium tracking-wide
                  transition-all duration-150 font-[family-name:var(--font-geist-mono)] uppercase
                  ${
                    isActive
                      ? "bg-[--ink] text-[--paper]"
                      : "text-[--ink-70] hover:text-[--ink] hover:bg-[--surface-alt]"
                  }
                `}
              >
                <Icon size={18} weight={isActive ? "fill" : "regular"} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / External link & Logout */}
      <div className="pt-6 border-t border-[--ink-12] flex flex-col gap-2">
        <Link
          href="/"
          target="_blank"
          className="
            flex items-center justify-between px-3 py-2 rounded-sm text-xs
            text-[--ink-70] hover:text-[--ink] hover:bg-[--surface-alt] transition-colors
            font-[family-name:var(--font-geist-mono)]
          "
        >
          <span>Lihat Website</span>
          <ArrowSquareOut size={16} />
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="
            flex items-center gap-3 px-3 py-2 rounded-sm text-xs text-red-600
            hover:bg-red-50 transition-colors font-[family-name:var(--font-geist-mono)] uppercase
          "
        >
          <SignOut size={18} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
