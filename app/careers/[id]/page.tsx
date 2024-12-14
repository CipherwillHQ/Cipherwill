import { FULL_HOSTNAME } from "@/common/constant";
import jobs from "@/components/app/careers/jobs_data";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LuBriefcaseBusiness, LuBuilding2, LuMapPin } from "react-icons/lu";

const title = "Careers";
const description =
  "Join Cipherwill and help shape the future of digital legacy management. Be part of a passionate team creating secure solutions for transferring digital assets to loved ones";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const job = jobs.find((job) => job.id === id);
  if (!job) {
    return redirect("/careers");
  }
  return {
    title: `${job.title} - Careers`,
    description: `Join Cipherwill as a ${job.title} in our ${job.division} division at ${job.location} (${job.level} level) and help us shape the future of Legacy Management.`,
    openGraph: {
      type: "website",
      title,
      description,
      images: ["/og-img.png"],
      url: `${FULL_HOSTNAME}/careers/${id}`,
    },
  };
}

export default async function JobDetails({ params }) {
  const { id } = await params;
  const job = jobs.find((job) => job.id === id);
  if (!job) {
    return redirect("/careers");
  }
  return (
    <div className="w-full">
      <Header />
      <div className="mt-40 mb-6 p-4 text-center">
        <div className="py-2 font-semibold">Job ID: {job.id.toUpperCase()}</div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold py-4">
          {job.title}
        </h1>
        <div className="p-3 flex flex-col sm:flex-row items-center gap-2 justify-center">
          <div className="text-lg font-semibold flex items-center gap-2">
            <LuBuilding2 />
            {job.division}
          </div>
          <div className="text-lg font-semibold flex items-center gap-2">
            <LuMapPin />
            {job.location}
          </div>
          <div className="text-lg font-semibold flex items-center gap-2">
            <LuBriefcaseBusiness />
            {job.level}
          </div>
        </div>

        <div className="py-8 border-b w-full max-w-4xl mx-auto">
          <Link
            href={"https://tally.so/r/3E8ZBl"}
            target="_blank"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-full"
          >
            Apply Now
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 text-lg">
        <div className="border-b pb-8">
          <h2 className="text-xl font-bold">Minimum Qualifications</h2>
          <ul className="list-disc pl-4 py-2">
            {job.min_qualifications.map((qualification) => (
              <li key={qualification}>{qualification}</li>
            ))}
          </ul>
          <br />
          <h2 className="text-xl font-bold">Preferred Qualifications</h2>
          <ul className="list-disc pl-4 py-2">
            {job.preferred_qualifications.map((qualification) => (
              <li key={qualification}>{qualification}</li>
            ))}
          </ul>
        </div>
        <div className="border-b py-8">
          <h2 className="text-xl font-bold pb-4">About the job</h2>
          <div>{job.about}</div>
        </div>
        <div className="pt-8">
          <h2 className="text-xl font-bold pb-4">Responsibilities</h2>
          <ul className="list-disc pl-4 py-2">
            {job.responsibilities.map((responsibility) => (
              <li key={responsibility}>{responsibility}</li>
            ))}
          </ul>
        </div>
        <div className="text-center pt-12">
          <Link
            href={"https://tally.so/r/3E8ZBl"}
            target="_blank"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-full"
          >
            Apply Now
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
