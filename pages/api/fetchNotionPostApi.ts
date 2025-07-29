// pages/api/fetchNotionPostApi.ts

import { NotionAPI } from "notion-client";
import type { NextApiRequest, NextApiResponse } from "next";

// Optional: add timeout wrapper to prevent Vercel 504
function withTimeout<T>(promise: Promise<T>, ms = 9000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), ms)
    ),
  ]);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const slug = req.query.slug as string;
    if (!slug) return res.status(400).json({ error: "Slug not found" });

    const id = slug.split("-").pop();
    if (!id || id.length < 10)
      return res.status(400).json({ error: "Invalid blog id" });

    const notion = new NotionAPI();

    const recordMap = await withTimeout(notion.getPage(id), 9000);
    const formated_id = Object.keys(recordMap.block)[0];
    const block = recordMap.block[formated_id].value;

    const title = block?.properties?.title?.[0]?.[0] || "Untitled";
    const description = block?.properties?.EUjp?.[0]?.[0] || "";
    const db_slug = block?.properties?.BlqG?.[0]?.[0] || "";
    const cover = block?.format?.page_cover || "";
    const created_time = block?.created_time;
    const last_edited_time = block?.last_edited_time;

    const final_cover = cover.startsWith("/")
      ? `https://www.notion.so${cover}`
      : `https://www.notion.so/image/${encodeURIComponent(
          cover
        )}?table=block&id=${formated_id}&cache=v2`;

    res.status(200).json({
      nonce: Math.random().toString(),
      id,
      formated_id,
      title,
      description,
      db_slug,
      cover: final_cover,
      created_time,
      last_edited_time,
      recordMap, // Optional — remove if size is too big
    });
  } catch (error: any) {
    console.error("Error fetching Notion post:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
