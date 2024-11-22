import getPost from "@/app/blog/[slug]/getPost";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default async function LegacyPost({ params }) {
  const { slug } = params;
  // const {
  //   id,
  //   title,
  //   description,
  //   db_slug,
  //   cover,
  //   created_time,
  //   last_edited_time,
  //   recordMap,
  //   nonce,
  //   error,
  // } = await getPost(slug);
  return (
    <div className="w-full">
      <Header />
      <div className="mt-20 py-20 text-center">
        <h1>{slug}</h1>
      </div>
      <Footer />
    </div>
  );
}
