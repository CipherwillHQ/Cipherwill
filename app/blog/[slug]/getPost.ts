import { cache } from "react";
import { getSupabaseServerClient } from "@/common/supabase/server";

const getPost = cache(async (slug: string) => {
  if (!slug) return { error: "Slug not passed" };
  const { client: supabase, error: supabaseClientError } =
    getSupabaseServerClient();
  if (supabaseClientError || !supabase)
    return {
      error: supabaseClientError,
    };

  const { data: post, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }

  if (!post) {
    return { error: "Post not found" };
  }

  // Fetch the HTML content from S3
  const htmlResponse = await fetch(`https://blogs.cipherwill.com/${post.slug}/index.html`);
  if (!htmlResponse.ok) {
    return { error: "Failed to fetch post content" };
  }
  const htmlContent = await htmlResponse.text();

  return {
    id: post.id,
    title: post.meta_title,
    description: post.meta_desc,
    slug: post.slug,
    created_time: Number(post.created_at),
    last_edited_time: Number(post.updated_at),
    htmlContent,
  };
});

export default getPost;
