import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client untuk dipakai di komponen client-side ("use client").
 * Menggunakan anon key — akses dibatasi oleh RLS policy.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

