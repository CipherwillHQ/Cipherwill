import { neon } from "@neondatabase/serverless";
import { FULL_HOSTNAME } from "@/common/constant";

export async function GET() {
  if (process.env.DATABASE_URL === undefined) {
    return new Response("DATABASE_URL is not defined", { status: 500 });
  }

  const sql = neon(process.env.DATABASE_URL);
  const blogs =
    await sql`SELECT slug, updated_at FROM blogs WHERE is_published = true ORDER BY id DESC`;

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${blogs
    .map((blog) => {
      const updated = new Date(parseInt(blog.updated_at));
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
