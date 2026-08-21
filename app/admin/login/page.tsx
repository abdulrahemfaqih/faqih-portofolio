"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Lock, ArrowLeft, Spinner } from "@phosphor-icons/react";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLoading) return;

    if (!email || !password) {
      toast.error("Email dan password wajib diisi");
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Gagal login. Cek kredensial Anda.");
        return;
      }

      toast.success("Login berhasil! Mengalihkan...");
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan saat login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        {/* Back to Home Link */}
        <Link
          href="/"
          className="
            inline-flex items-center gap-2 mb-8
            font-[family-name:var(--font-geist-mono)] text-xs tracking-wide uppercase
            text-[--ink-45] hover:text-[--ink] transition-colors
          "
        >
          <ArrowLeft size={14} weight="bold" />
          Kembali ke Website
        </Link>

        {/* Card */}
        <div className="card p-8 bg-[--paper]">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[--ink-12]">
            <div className="p-2.5 rounded-sm bg-[--surface-alt] text-[--ink] border border-[--ink-12]">
              <Lock size={20} weight="bold" />
            </div>
            <div>
              <h1 className="text-h2 font-[family-name:var(--font-fraunces)] text-[--ink]">
                Admin Login
              </h1>
              <p className="text-small text-[--ink-45]">
                Masuk untuk mengelola konten portfolio
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="admin-email"
                className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]"
              >
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="
                  px-3 py-2.5 rounded-sm border border-[--ink-12] bg-transparent text-[--ink]
                  placeholder:text-[--ink-45] text-sm
                  focus-visible:outline-2 focus-visible:outline-[--ink] focus-visible:outline-offset-2
                  transition-colors hover:border-[--ink-45]
                "
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="admin-password"
                className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="
                  px-3 py-2.5 rounded-sm border border-[--ink-12] bg-transparent text-[--ink]
                  placeholder:text-[--ink-45] text-sm
                  focus-visible:outline-2 focus-visible:outline-[--ink] focus-visible:outline-offset-2
                  transition-colors hover:border-[--ink-45]
                "
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-solid mt-2 w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Spinner size={16} className="animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                "Masuk ke Dashboard"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
