// pages/api/fetchNotionPostApi.ts

import { NotionAPI } from "notion-client";
import { Client } from "@notionhq/client";
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

function normalizeNotionId(value: string) {
  return (value || "").replaceAll("-", "").toLowerCase();
}

function toUuid(value: string) {
  const normalized = normalizeNotionId(value);
  if (normalized.length !== 32) return value;
  return `${normalized.slice(0, 8)}-${normalized.slice(
    8,
    12
  )}-${normalized.slice(12, 16)}-${normalized.slice(16, 20)}-${normalized.slice(
    20
  )}`;
}

function plainTextFromRichText(items: any[] | undefined): string {
  if (!Array.isArray(items)) return "";
  return items.map((item) => item?.plain_text || "").join("").trim();
}

function readPropertyText(property: any): string {
  if (!property) return "";
  if (property.type === "title") return plainTextFromRichText(property.title);
  if (property.type === "rich_text")
    return plainTextFromRichText(property.rich_text);
  if (property.type === "formula") return property.formula?.string || "";
  if (property.type === "url") return property.url || "";
  return "";
}

function pickPropertyTextByNames(
  properties: Record<string, any> | undefined,
  names: string[]
) {
  if (!properties) return "";
  const lowered = names.map((name) => name.toLowerCase());

  const exact = Object.entries(properties).find(([key]) =>
    lowered.includes(key.toLowerCase())
  );
  if (exact) {
    const text = readPropertyText(exact[1]);
    if (text) return text;
  }

  const partial = Object.entries(properties).find(([key]) =>
    lowered.some((name) => key.toLowerCase().includes(name))
  );
  if (partial) return readPropertyText(partial[1]);

  return "";
}

function readLegacyText(prop: any): string {
  if (!Array.isArray(prop)) return "";
  return prop
    .map((chunk: any) => (Array.isArray(chunk) ? chunk[0] : ""))
    .filter(Boolean)
    .join("")
    .trim();
}

function resolvePageBlock(recordMap: any, rawId: string) {
  const entries = Object.entries(recordMap?.block || {});
  if (!entries.length) return { formated_id: rawId, block: {} as any };

  const matchedEntry =
    entries.find(([key, entry]) => {
      const value = (entry as any)?.value || entry;
      return (
        normalizeNotionId(key) === normalizeNotionId(rawId) ||
        normalizeNotionId((value as any)?.id || "") === normalizeNotionId(rawId)
      );
    }) ||
    entries.find(([, entry]) => {
      const value = (entry as any)?.value || entry;
      return (value as any)?.type === "page";
    }) ||
    entries[0];

  const formated_id = matchedEntry?.[0] || rawId;
  const blockEntry = matchedEntry?.[1];
  const block =
    blockEntry && "value" in (blockEntry as any)
      ? (blockEntry as any).value
      : blockEntry;

  return { formated_id, block };
}

function buildFinalCover(cover: string, formatedId: string) {
  if (!cover) return "";

  if (cover.startsWith("/")) {
    return `https://www.notion.so${cover}`;
  }

  if (cover.startsWith("http")) {
    const coverWithoutQuery = cover.split("?")[0];
    const isNotionFile =
      cover.includes("prod-files-secure.s3") ||
      cover.includes("secure.notion-static.com") ||
      cover.includes("amazonaws.com");

    if (isNotionFile) {
      return `https://www.notion.so/image/${encodeURIComponent(
        coverWithoutQuery
      )}?table=block&id=${formatedId}&cache=v2`;
    }

    return cover;
  }

  return `https://www.notion.so/image/${encodeURIComponent(
    cover
  )}?table=block&id=${formatedId}&cache=v2`;
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

    const legacyNotion = new NotionAPI();
    const notion = new Client({ auth: process.env.NOTION_API_KEY });

    const recordMap = await withTimeout(legacyNotion.getPage(id), 9000);
    const { formated_id, block } = resolvePageBlock(recordMap, id);

    let title = (block as any)?.properties?.title?.[0]?.[0] || "Untitled";
    let description =
      readLegacyText((block as any)?.properties?.description) || "";
    let db_slug = readLegacyText((block as any)?.properties?.slug) || "";
    let cover = (block as any)?.format?.page_cover || "";
    let created_time = (block as any)?.created_time;
    let last_edited_time = (block as any)?.last_edited_time;

    try {
      const page = await withTimeout(
        notion.pages.retrieve({
          page_id: toUuid((block as any)?.id || id),
        }),
        9000
      );

      if ("properties" in page) {
        title =
          pickPropertyTextByNames(page.properties as any, ["Name"]) ||
          title;
        description =
          pickPropertyTextByNames(page.properties as any, ["Description"]) ||
          description;
        db_slug =
          pickPropertyTextByNames(page.properties as any, ["slug"]) || db_slug;
      }

      if ("cover" in page && page.cover) {
        if (page.cover.type === "external") {
          cover = page.cover.external.url || cover;
        } else if (page.cover.type === "file") {
          cover = page.cover.file.url || cover;
        }
      }

      if ("created_time" in page) created_time = page.created_time || created_time;
      if ("last_edited_time" in page) {
        last_edited_time = page.last_edited_time || last_edited_time;
      }
    } catch {
      // Keep legacy metadata fallbacks from recordMap only.
    }

    const final_cover = buildFinalCover(cover, formated_id);

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
      recordMap, // Optional - remove if size is too big
    });
  } catch (error: any) {
    console.error("Error fetching Notion post:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
