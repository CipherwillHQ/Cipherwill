import { neon } from "@neondatabase/serverless";

async function getBlogPosts({ cursor }: { cursor?: string }) {
  if (process.env.DATABASE_URL === undefined)
    return {
      error: "DATABASE_URL is not defined",
    };
  const sql = neon(process.env.DATABASE_URL);
  
  let response;
  if (cursor) {
    response = await sql`SELECT * FROM blogs WHERE id < ${cursor} AND is_published = true ORDER BY id DESC LIMIT 21`;
  } else {
    response = await sql`SELECT * FROM blogs WHERE is_published = true ORDER BY id DESC LIMIT 21`;
  }

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
