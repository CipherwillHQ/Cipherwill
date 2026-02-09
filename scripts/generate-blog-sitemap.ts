// Load environment variables BEFORE importing anything else
import { config } from "dotenv";
import { existsSync } from "fs";
import { join } from "path";

// Load environment variables the same way Next.js does
let envLoaded = false;
const envPaths = [
  join(process.cwd(), ".env.local"),
  process.env.NODE_ENV === "production"
    ? join(process.cwd(), ".env.production")
    : join(process.cwd(), ".env.development"),
  join(process.cwd(), ".env"),
];

for (const envPath of envPaths) {
  if (existsSync(envPath)) {
    config({ path: envPath });
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.log("⚠️  No .env files found, using system environment variables");
}

// Now import the rest
import { getNotionPosts } from "../app/blog/getNotionPosts";
import { writeFileSync } from "fs";

const PAGE_SIZE = 100;

interface BlogPost {
  id: string;
  last_edited_time: string;
  properties: {
    slug: {
      rich_text: Array<{
        text: {
          content: string;
        };
      }>;
    };
  };
}

async function testNotionConnection() {
  try {
    const response = await getNotionPosts({ size: 1 });
    return true;
  } catch (error) {
    console.error("❌ Notion API connection failed:", error.message);
    return false;
  }
}

async function getAllBlogPosts(): Promise<BlogPost[]> {
  let all_pages: BlogPost[] = [];
  let cursor: string | undefined = undefined;
  let has_more = true;

  while (has_more) {
    const response = await getNotionPosts({
      cursor,
      size: PAGE_SIZE,
    });

    all_pages = all_pages.concat((response.pages as unknown) as BlogPost[]);

    has_more = response.has_more;
    cursor = response.next_cursor || undefined;
  }

  return all_pages;
}

function generateSitemapXML(posts: BlogPost[]): string {
  const urls = posts
    .map((page) => {
      const slug = page.properties.slug.rich_text[0]?.text.content;
      if (!slug) return null;

      const url = `https://www.cipherwill.com/blog/${slug}-${page.id.replaceAll("-", "")}`;
      const lastmod = new Date(page.last_edited_time).toISOString();

      return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
    })
    .filter(Boolean)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

async function main() {
  try {
    // Check environment variables
    if (!process.env.NOTION_API_KEY) {
      console.error("❌ NOTION_API_KEY is not set in environment variables");
      process.exit(1);
    }
    if (!process.env.NOTION_DB_ID) {
      console.error("❌ NOTION_DB_ID is not set in environment variables");
      process.exit(1);
    }

    // Test Notion connection first
    const connectionOk = await testNotionConnection();
    if (!connectionOk) {
      console.error("❌ Cannot proceed without valid Notion API connection");
      process.exit(1);
    }

    const posts = await getAllBlogPosts();

    const xml = generateSitemapXML(posts);

    const outputPath = join(process.cwd(), "public", "blogs-sitemap.xml");
    writeFileSync(outputPath, xml, "utf-8");

    console.log(`✅ Blog sitemap generated successfully with ${posts.length} URLs`);
  } catch (error) {
    console.error("❌ Error generating sitemap:", error.message);
    process.exit(1);
  }
}

main();

// Export the main function for external use (like cron jobs)
export async function generateSitemap() {
  // Re-run the main logic without process.exit
  try {
    if (!process.env.NOTION_API_KEY) {
      throw new Error("NOTION_API_KEY is not set in environment variables");
    }
    if (!process.env.NOTION_DB_ID) {
      throw new Error("NOTION_DB_ID is not set in environment variables");
    }

    const connectionOk = await testNotionConnection();
    if (!connectionOk) {
      throw new Error("Cannot proceed without valid Notion API connection");
    }

    const posts = await getAllBlogPosts();
    const xml = generateSitemapXML(posts);

    const outputPath = join(process.cwd(), "public", "blogs-sitemap.xml");
    writeFileSync(outputPath, xml, "utf-8");

    return { success: true, urlCount: posts.length };
  } catch (error) {
    throw error;
  }
}