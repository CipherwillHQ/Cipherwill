import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function getNotionPosts({
  cursor,
  size = 10,
  databaseId = process.env.NOTION_DB_ID,
}: {
  cursor?: string;
  size?: number;
  databaseId?: string;
}) {
  const response = await notion.databases.query({
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
  };
}
