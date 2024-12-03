import RenderPlate from "./RenderPlate";
import CheckURL from "./CheckURL";
import getPost from "./getPost";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import getTimeAgo from "@/common/time/getTimeAgo";
import { FULL_HOSTNAME } from "@/common/constant";
import CTA from "@/components/public/CTA";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import BlogAd from "./BlogAd";

const CoverImage = dynamic(() => import("./CoverImage"));

// Page cache not working because of dynamic route
// making function getPost memoizable and using fetchPostApi to cache data

export async function generateMetadata({
  params,
  searchParams,
}): Promise<Metadata> {
  const { slug } = await params;
  const { title, description, cover, error } = await getPost(slug);
  if (error) {
    console.log("error", error);
    return redirect("/blog");
  }

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      images: [cover],
      url: `${FULL_HOSTNAME}/blog/${slug}`,
    },
  };
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const {
    id,
    title,
    description,
    db_slug,
    cover,
    created_time,
    last_edited_time,
    recordMap,
    nonce,
    error,
  } = await getPost(slug);
  if (error) {
    console.log("error", error);
    return redirect("/blog");
  }

  return (
    <div>
      <Header />
      <div className="py-20">
        <CheckURL slug={db_slug} id={id} />
        {/* {JSON.stringify(recordMap.block)} */}
        <div className="text-center max-w-4xl mx-auto p-2 my-8">
          {/* Blog Post for {slug} and {id} */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold py-8 leading-normal sm:leading-normal md:leading-normal">
            {title}
          </h1>
          <p className="max-w-3xl mx-auto text-lg font-medium">{description}</p>
          <div className="text-xs sm:text-sm text-gray-500 py-4">
            Created - {getTimeAgo(created_time, true)}
            {" | "}
            Updated - {getTimeAgo(last_edited_time, true)}
          </div>
        </div>
        <CoverImage cover={cover} title={title} />
        <div className="flex justify-center max-w-7xl mx-auto">
          <div className="max-w-4xl" suppressHydrationWarning>
            <RenderPlate recordMap={recordMap} />
          </div>
          <div className="hidden xl:flex flex-col items-center w-[350px] my-10 ml-2">
            <div className="sticky top-20 bottom-0">
              <BlogAd />
            </div>
          </div>
        </div>
        <div className="p-4 xl:hidden">
          <BlogAd />
        </div>
      </div>
      <CTA />
      <Footer />
    </div>
  );
}
