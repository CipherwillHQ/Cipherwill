import getTimeAgo from "@/common/time/getTimeAgo";
import Image from "next/image";
import Link from "next/link";

export default function FirstPost({ page }: { page: any }) {
  const title = page.properties.Name.title[0].text.content;
  const slug = page.properties.slug.rich_text[0].text.content;
  const created = new Date(page.created_time);
  const updated = new Date(page.last_edited_time);
  const banner =
    page.cover.type === "external"
      ? page.cover.external.url
      : page.cover.type === "file"
      ? page.cover.file.url
      : "https://www.cipherwill.com/og-img.png";
  let banner_url = new URL(banner);
  banner_url.search = "";

  return (
    <div className="p-4">
      <div className="flex pb-2 sm:pb-12 px-2 mx-auto max-w-7xl">
        <Link
          href={`/blog/${slug}-${page.id.replaceAll("-", "")}`}
          className="flex flex-col sm:flex-row"
        >
          <Image
            width={500}
            height={1000}
            className="sm:rounded-xl aspect-video w-full sm:w-1/2 object-cover max-h-[250px]"
            src={
              banner_url.href.startsWith("https://www.cipherwill.com")
                ? banner_url.href
                : `https://www.notion.so/image/${encodeURIComponent(
                    banner_url.href
                  )}?table=block&id=${page.id}&cache=v2`
            }
            alt={`Cover for ${title}`}
          />
          <div className="flex flex-col justify-between py-4 sm:px-4 sm:pt-0 border-b sm:border-b-0 w-full sm:w-1/2">
            <div>
              <h2 className="text-2xl font-semibold line-clamp-2">
                {title}
              </h2>
              <p className="text-base sm:text-xl line-clamp-3">
                {page.properties.Description.rich_text[0].text.content}
              </p>
            </div>

            <div className="text-sm pt-2 text-gray-500">
              Last updated on {getTimeAgo(updated.getTime(), true)}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
