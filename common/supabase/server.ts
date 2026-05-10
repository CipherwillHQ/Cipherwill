import { createServerClient } from "@supabase/ssr";

export function getSupabaseServerClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const supabaseAccessKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    return {
      error:
        "NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) is not defined",
    };
  }

  if (!supabaseAccessKey) {
    return {
      error:
        "SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_ANON_KEY) is not defined",
    };
  }

  const client = createServerClient(supabaseUrl, supabaseAccessKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        // No auth session persistence is required for server-side read queries.
      },
    },
  });

  return { client };
}
