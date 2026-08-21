"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import { List } from "@phosphor-icons/react";
import { Toaster } from "react-hot-toast";

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export default function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Jika halaman login, jangan tampilkan sidebar admin shell
  if (pathname === "/admin/login") {
    return (
      <div className="min-h-screen bg-[--paper] flex flex-col justify-center">
        <Toaster position="bottom-right" />
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[--paper] flex flex-col md:flex-row">
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

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 shrink-0 h-screen sticky top-0">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-[--ink]/50 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 w-64 h-full bg-[--paper]">
            <AdminSidebar onCloseMobile={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header bar */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-[--ink-12] bg-[--paper] sticky top-0 z-20">
          <span className="font-[family-name:var(--font-fraunces)] font-bold text-base text-[--ink]">
            Portfolio Admin
          </span>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 text-[--ink] rounded-sm hover:bg-[--surface-alt]"
            aria-label="Buka menu"
          >
            <List size={22} />
          </button>
        </div>

        {/* Content wrapper */}
        <main className="flex-1 p-6 md:p-10 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
