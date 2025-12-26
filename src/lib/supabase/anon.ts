import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Creates an anonymous Supabase client without cookie handling.
 * Use this for public data queries that don't require authentication,
 * such as sitemap generation during static builds.
 */
export function createAnonClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
