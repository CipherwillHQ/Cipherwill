import { getSupabaseServerClient } from "@/common/supabase/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_FULL_HOSTNAME || "https://www.cipherwill.com";

export const revalidate = 3600;

export async function GET() {
  const { client: supabase, error: supabaseClientError } =
    getSupabaseServerClient();

  if (supabaseClientError || !supabase) {
    return new Response("Failed to connect to database", { status: 500 });
  }

  const { data: posts, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return new Response("Failed to fetch posts", { status: 500 });
  }

  const items = (posts ?? []).map((post: Record<string, unknown>) => {
    const pubDate = new Date(Number(post.created_at)).toUTCString();
    const postUrl = `${BASE_URL}/blog/${post.slug}`;
    const imageUrl = `https://blogs.cipherwill.com/${post.slug}/index.png`;
    const description = String(post.meta_desc ?? "");

    return `<item>
      <title>${escapeXml(String(post.meta_title ?? ""))}</title>
      <link>${escapeXml(postUrl)}</link>
      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${pubDate}</pubDate>
      <enclosure url="${escapeXml(imageUrl)}" length="0" type="image/png" />
    </item>`;
  }).join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Cipherwill Blog</title>
    <link>${escapeXml(BASE_URL)}/blog</link>
    <description>Digital legacy planning insights and updates from Cipherwill</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(BASE_URL)}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
