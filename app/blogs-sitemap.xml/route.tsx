import { getServerSideSitemap } from "next-sitemap";
import { getNotionPosts } from "../blog/getNotionPosts";

const PAGE_SIZE = 100;

export async function GET(request: Request) {
  let thats_all = false;
  let all_pages: any[] = [];

  while (!thats_all) {
    const cursor =
      all_pages.length > 0 ? all_pages[all_pages.length - 1].id : undefined;

    const { pages } = await getNotionPosts({
      cursor,
      size: PAGE_SIZE,
    });
    if (cursor) {
      // skip first page as it is the cursor page from last results
      all_pages = all_pages.concat(pages.slice(1));
    } else {
      all_pages = all_pages.concat(pages);
    }

    if (pages.length < PAGE_SIZE) {
      thats_all = true;
    }
  }
  const urls = all_pages.map((page: any) => {
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
