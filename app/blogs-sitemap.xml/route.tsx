import { getServerSideSitemap } from "next-sitemap";
import { getNotionPosts } from "../blog/getNotionPosts";

export async function GET(request: Request) {
  const { pages } = await getNotionPosts({
    size: 100,
  })

  const urls = pages.map((page: any) => {
    const slug = page.properties.slug.rich_text[0].text.content;
    return {
      loc: `https://www.cipherwill.com/blog/${slug}-${page.id.replaceAll(
        "-",
        ""
      )}`,
      lastmod: new Date(page.last_edited_time).toISOString(),
    };
  });

  return getServerSideSitemap(urls);
}
