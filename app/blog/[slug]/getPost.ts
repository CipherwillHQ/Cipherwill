import { neon } from "@neondatabase/serverless";
import { cache } from "react";

const getPost = cache(async (slug: string) => {
  if (!slug) return { error: "Slug not passed" };
  if (process.env.DATABASE_URL === undefined)
    return {
      error: "DATABASE_URL is not defined",
    };
  const sql = neon(process.env.DATABASE_URL);
  const response = await sql`SELECT * FROM blogs WHERE slug = ${slug} AND is_published = true LIMIT 1`;
  
  if (response.length === 0) {
    return { error: "Post not found" };
  }

  const post = response[0];
  
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
    created_time: parseInt(post.created_at),
    last_edited_time: parseInt(post.updated_at),
    htmlContent,
  };
});

export default getPost;
