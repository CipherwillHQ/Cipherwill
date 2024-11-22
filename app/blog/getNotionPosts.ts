import { Client } from "@notionhq/client";

const notion = new Client({
  auth: "secret_2SE7KRu7hxaSFTX36wZ2Ly0eDgzFSw5wfuqvH2mm3dO",
});

export async function getNotionPosts({
  cursor,
  size = 10,
  databaseId = "ceddbc0d0ed148008abb01dc65d12fcf",
}:{
  cursor?: string
  size?: number
  databaseId?: string
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
