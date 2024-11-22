import Footer from "@/components/Footer";
import Header from "@/components/Header";
import personas from "../data";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { FULL_HOSTNAME } from "@/common/constant";
import Link from "next/link";
import CTA from "@/components/public/CTA";

function getDescription(job: string) {
  return `Learn how ${job} can easily create and manage a digital will to ensure their online accounts and assets are securely passed on to their chosen beneficiaries.`;
}

export async function generateMetadata({
  params,
  searchParams,
}): Promise<Metadata> {
  const slug = params.slug;
  const persona = personas.find((persona) => persona.slug === slug);
  if (!persona) return redirect("/i/personas");
  const { title: persona_title, persona: job } = persona;
  const title = `${persona_title} - Cipherwill`;
  const description = getDescription(job);

  return {
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      images: ["/og-img.png"],
      url: `${FULL_HOSTNAME}/i/personas/${slug}`,
    },
  };
}

export default function PersonaPage({ params }) {
  const slug = params.slug;
  const persona = personas.find((persona) => persona.slug === slug);
  if (!persona) return redirect("/i/personas");

  return (
    <div>
      <Header />
      <div className="mt-20 py-20 text-center px-4">
        <h1 className="text-2xl md:text-4xl font-bold ">{persona.title}</h1>
        <div className="md:text-lg font-medium py-4 max-w-3xl mx-auto">
          {getDescription(persona.persona)}
        </div>
      </div>
      <div className="flex flex-col gap-4 max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold pb-2">
          Create your Digital will with Cipherwill
        </h2>
        <img
          src="/og-img.png"
          alt="og-img"
          className="w-full max-w-4xl mx-auto rounded-md"
        />
        <div className="text-lg font-medium">
          Cipherwill is a digital platform where people add their data such as
          bank details, investments, properties, digital assets, etc. and create
          an electronic will which is based end-to-end encryption. After the
          person has passed away and cannot update the will within the
          predefined time the access of the data will be delivered to the
          beneficiaries.
        </div>
        <Link
          href="/"
          className="bg-black text-white p-2 rounded-md text-center"
        >
          Learn more about Cipherwill
        </Link>
      </div>
      <div className="flex flex-col gap-4 max-w-4xl mx-auto p-4">
        {persona.data.map((data, index) => {
          return (
            <div key={index} className="font-medium whitespace-pre-wrap">
              <h2 className="text-2xl font-bold pb-2">{data.header}</h2>
              <div className="">
                {data.content &&
                  data.content.map((content, index) => {
                    return (
                      <div key={index} className="py-2">
                        {content.subheading && (
                          <h3 className="text-lg font-bold">
                            {content.subheading}
                          </h3>
                        )}
                        <p className="text-lg">{content.text}</p>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
      <CTA />
      <Footer />
    </div>
  );
}
