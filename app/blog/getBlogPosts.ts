import { getSupabaseServerClient } from "@/common/supabase/server";

async function getBlogPosts({ cursor }: { cursor?: string }) {
  const { client: supabase, error: supabaseClientError } =
    getSupabaseServerClient();
  if (supabaseClientError || !supabase)
    return {
      error: supabaseClientError,
    };

  let query = supabase
    .from("blogs")
    .select("*")
    .eq("is_published", true)
    .order("id", { ascending: false })
    .limit(21);

  if (cursor) {
    query = query.lt("id", cursor);
  }

  const { data, error } = await query;
  if (error) {
    return {
      error: error.message,
    };
  }

  const response = data ?? [];
  const pages = response.slice(0, 20);
  const has_more = response.length > 20;
  const next_cursor = has_more ? pages[pages.length - 1].id : null;

  return {
    pages,
    has_more,
    next_cursor,
  };
}
export default getBlogPosts;
