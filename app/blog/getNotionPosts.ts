import { Client } from "@notionhq/client";

let notion: Client | null = null;

function getNotionClient() {
  if (!notion) {
    notion = new Client({
      auth: process.env.NOTION_API_KEY,
    });
  }
  return notion;
}

export async function getNotionPosts({
  cursor,
  size = 10,
  databaseId = process.env.NOTION_DB_ID,
}: {
  cursor?: string;
  size?: number;
  databaseId?: string;
}) {
  if (!databaseId) return {
    pages: [],
    has_more: false,
    next_cursor: null,
  };
  const response = await getNotionClient().databases.query({
    database_id: databaseId,
    page_size: size,
    start_cursor: cursor,
    filter: {
      property: "Publish",
      checkbox: {
        equals: true,
      },
    },
    sorts: [
      {
        property: "Created time",
        direction: "descending",
      },
    ],
  });

  if (response.results && response.results.length > 0) {
    return {
      pages: response.results,
      has_more: response.has_more,
      next_cursor: response.next_cursor,
    };
  }

  return {
    pages: [],
    has_more: false,
    next_cursor: null,
  };
}
