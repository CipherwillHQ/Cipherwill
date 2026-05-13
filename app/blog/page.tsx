import Link from "next/link";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import getTimeAgo from "@/common/time/getTimeAgo";
import { FULL_HOSTNAME } from "@/common/constant";
import CTA from "@/components/public/CTA";
import FirstPost from "@/components/app/blog/FirstPost";
import getBlogPosts from "./getBlogPosts";

// Page cache configs
export const revalidate = 3600; // 1 hour

const title = "Digital Legacy Blog by Cipherwill";
const description =
  "Discover insights and tips on managing your digital legacy. Stay informed about digital estate planning, online security, and protecting your digital assets.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/blog`,
  },
};

export default async function Blog({ params, searchParams }: any) {
  const { cursor } = await searchParams;
  const { pages, has_more, next_cursor } = await getBlogPosts({ cursor });
  const first_page = pages ? pages[0] : null;
  const remaining_pages = pages ? pages.slice(1) : [];

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center py-5 px-2 mt-36 mb-14">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
          Digital Legacy Blog by Cipherwill
        </h1>
        <p className="mt-4 max-w-lg text-lg text-center">
          Discover how your online presence lives on in the digital realm for
          your loved ones
        </p>
      </div>

      <FirstPost page={first_page} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-2 py-10 gap-2 max-w-7xl mx-auto">
        {remaining_pages.map((page: any) => {
          const title = page.meta_title;
          const slug = page.slug;
          const created = new Date(parseInt(page.created_at));
          const updated = new Date(parseInt(page.updated_at));
          const banner = `https://blogs.cipherwill.com/${page.slug}/index.png`;
          let banner_url = new URL(banner);
          banner_url.search = "";

          return (
            <Link
              href={`/blog/${slug}`}
              key={page.id}
              className="border-b last:border-0 sm:last:border sm:border sm:rounded-lg my-8 sm:my-0"
            >
              <div className="w-full">
                <Image
                  width={400}
                  height={225}
                  className="aspect-video p-2 sm:p-0 max-h-62.5 w-full object-cover rounded-t-lg"
                  src={banner_url.href}
                  alt={title}
                  unoptimized
                />
                <div className="p-2">
                  <h2 className="text-xl font-semibold line-clamp-2">
                    {title}
                  </h2>
                  <p className="line-clamp-3">
                    {page.meta_desc}
                  </p>
                  {/* Crated at : {created.toLocaleString()} */}

                  <div className="text-sm py-2 text-gray-500">
                    Last updated on {getTimeAgo(updated.getTime(), true)}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {has_more && (
        <div className="flex justify-center">
          <Link
            href={`/blog?cursor=${next_cursor}`}
            className="text-center font-semibold hover:underline"
          >
            Load more
          </Link>
        </div>
      )}
      <CTA />
      <Footer />
    </div>
  );
}
