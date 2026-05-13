import getTimeAgo from "@/common/time/getTimeAgo";
import Image from "next/image";
import Link from "next/link";

export default function FirstPost({ page }: { page: any }) {
  if (!page) return null;
  const title = page.meta_title;
  const slug = page.slug;
  const created = new Date(parseInt(page.created_at));
  const updated = new Date(parseInt(page.updated_at));
  const banner = `https://blogs.cipherwill.com/${page.slug}/index.png`;
  let banner_url = new URL(banner);
  banner_url.search = "";

  return (
    <div className="p-4">
      <div className="flex pb-2 sm:pb-12 px-2 mx-auto max-w-7xl">
        <Link href={`/blog/${slug}`} className="flex flex-col sm:flex-row">
          <Image
            width={500}
            height={1000}
            className="sm:rounded-xl aspect-video w-full sm:w-1/2 object-cover max-h-62.5"
            src={banner_url.href}
            alt={title}
            unoptimized
          />
          <div className="flex flex-col justify-between py-4 sm:px-4 sm:pt-0 border-b sm:border-b-0 w-full sm:w-1/2">
            <div>
              <h2 className="text-2xl font-semibold line-clamp-2">{title}</h2>
              <p className="text-base sm:text-xl line-clamp-3">
                {page.meta_desc}
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
