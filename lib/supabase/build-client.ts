import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client untuk build-time (generateStaticParams, generateMetadata).
 * Tidak menggunakan cookies karena berjalan tanpa HTTP request.
 * Menggunakan anon key — hanya untuk membaca data publik.
 */
export function createBuildTimeClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

