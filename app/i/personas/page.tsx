import Footer from "@/components/Footer";
import Header from "@/components/Header";
import personas from "./data";
import Link from "next/link";
import { FULL_HOSTNAME } from "@/common/constant";

const title = "Guide to Manage Your Digital Will - Cipherwill";
const description =
  "Learn how professionals like developers, marketers, and entrepreneurs can manage their digital assets with tailored guides for creating a secure digital will.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/i/personas`,
  },
};

export default function PersonasPage() {
  return (
    <div>
      <Header />
      <div className="mt-20 py-20 text-center text-4xl font-bold px-2">
        <h1>Guide to manage your digital will</h1>
      </div>
      <div className="flex flex-col gap-2 max-w-7xl mx-auto p-2">
        {personas.map((persona, index) => {
          return (
            <div key={index} className="border font-medium rounded-md p-2">
              <Link href={`/i/personas/${persona.slug}`} className="hover:underline">
                <p>{persona.title}</p>
              </Link>
            </div>
          );
        })}
      </div>
      <Footer />
    </div>
  );
}
