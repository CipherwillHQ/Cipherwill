import { NotionAPI } from "notion-client";
import { NextResponse } from "next/server";

export const runtime = "nodejs"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if(!slug) return NextResponse.json({error: "Slug not found"});
  const notion = new NotionAPI();
  const id = slug.split("-").pop();
  if(id.length <  10) return NextResponse.json({error: "Invalid blog id"});
    // console.log(`Fetching blog post with id: ${id}`);
    
  const recordMap = await notion.getPage(id);
  const formated_id = Object.keys(recordMap.block)[0];
  const title = recordMap.block[formated_id].value.properties.title[0][0];
  
  const description =
    recordMap.block[formated_id].value.properties["EUjp"][0][0];
  const db_slug = recordMap.block[formated_id].value.properties["BlqG"][0][0];
  const cover = recordMap.block[formated_id].value.format.page_cover;
  const created_time = recordMap.block[formated_id].value.created_time;
  const last_edited_time = recordMap.block[formated_id].value.last_edited_time;
  const final_cover = cover.startsWith("/")
    ? `https://www.notion.so${cover}`
    : `https://www.notion.so/image/${encodeURIComponent(
        cover
      )}?table=block&id=${formated_id}&cache=v2`;

  return NextResponse.json({
    nonce: Math.random().toString(),
    id,
    formated_id,
    title,
    description,
    db_slug,
    cover: final_cover,
    created_time,
    last_edited_time,
    recordMap,
  });
}
