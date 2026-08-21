import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

/**
 * Supabase client untuk build-time (generateStaticParams, generateMetadata).
 * Tidak menggunakan cookies karena berjalan tanpa HTTP request.
 * Menggunakan anon key — hanya untuk membaca data publik.
 */
export function createBuildTimeClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
