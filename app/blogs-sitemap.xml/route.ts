import { FULL_HOSTNAME } from "@/common/constant";
import { getSupabaseServerClient } from "@/common/supabase/server";

export async function GET() {
  const { client: supabase, error: supabaseClientError } =
    getSupabaseServerClient();
  if (supabaseClientError || !supabase) {
    return new Response(supabaseClientError, { status: 500 });
  }

  const { data: blogs, error } = await supabase
    .from("blogs")
    .select("slug,updated_at")
    .eq("is_published", true)
    .order("id", { ascending: false });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  const safeBlogs = blogs ?? [];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${safeBlogs
    .map((blog) => {
      const updated = new Date(Number(blog.updated_at));
      return `
  <url>
    <loc>${FULL_HOSTNAME}/blog/${blog.slug}</loc>
    <lastmod>${updated.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  `;
    })
    .join("")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
