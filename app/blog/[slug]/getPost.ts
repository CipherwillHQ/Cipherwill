import { BUILD_ENV, IS_PRODUCTION } from "@/common/constant";
import logger from "@/common/debug/logger";
import { cache } from "react";

const getPost = cache(async (slug: string) => {
  if (!slug) return { error: "Slug not passed" };
  const data = await fetch(
    // IS_PRODUCTION
    //   ?
    `https://www.cipherwill.com/api/fetchNotionPostApi?slug=${slug}`,
    //  `http://localhost:3000/api/fetchNotionPostApi?slug=${slug}`,
    {
      next: IS_PRODUCTION
        ? {
            revalidate: 10800, // cache for 3 hours
          }
        : {},
    }
  );
  const json = await data.json().catch((err) => {
    logger.error("Error fetching post data:", err);
    return { error: "Failed to fetch post data" };
  });
  return json;
});

export default getPost;
