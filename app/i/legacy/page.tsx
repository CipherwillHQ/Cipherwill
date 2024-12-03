import { getNotionPosts } from "@/app/blog/getNotionPosts";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";

export default async function Legacy() {
  const { pages, has_more, next_cursor } = await getNotionPosts({
    databaseId: "1046d63626188023be37c2923dc837e6",
    size: 100,
  });

  return (
    <div className="w-full">
      <Header />
      <div className="mt-20 py-20">
        <h1 className="text-4xl md:text-7xl font-bold text-center">Legacy</h1>
      </div>
      <div className="max-w-7xl mx-auto w-full p-2">
        {pages.map((page: any) => {
          const title = page.properties.Name.title[0].text.content;
          const slug = page.properties.slug.rich_text[0].text.content;
          return (
            <Link
              key={page.id}
              href={`/i/legacy/${slug}-${page.id.replaceAll("-", "")}`}
              className="hover:underline"
            >
              <div className="w-full p-1 border-b text-2xl lg:text-4xl">
                {title}
              </div>
            </Link>
          );
        })}
      </div>
      <Footer />
    </div>
  );
}
