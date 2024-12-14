import { FULL_HOSTNAME } from "@/common/constant";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import jobs from "@/components/app/careers/jobs_data";
import Link from "next/link";
import { LuBriefcaseBusiness, LuBuilding2, LuMapPin } from "react-icons/lu";

const title = "Careers";
const description =
  "Join Cipherwill and help shape the future of digital legacy management. Be part of a passionate team creating secure solutions for transferring digital assets to loved ones";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/careers`,
  },
};

export default function Careers() {
  return (
    <div className="w-full">
      <Header />
      <div className="mt-40 mb-6 p-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
          Join the Cipherwill team
        </h1>
        <div className="p-4 text-center text-xl font-semibold">
          Help shape the future of Legacy Management
        </div>

        <p className="max-w-xl mx-auto py-2 text-center sm:text-lg font-medium dark:font-normal">
          Cipherwill is a team of passionate peoples, creating secure solutions
          for transferring digital assets to loved ones. Join us in our mission
          to create a secure digital legacy for everyone.
        </p>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-xl font-bold">Open Positions</h2>
        <div className="grid grid-cols-1 gap-4 py-8">
          {jobs.map((job) => (
            <div key={job.id} className="p-4 border rounded-md shadow-lg">
              <h3 className="text-2xl font-bold">{job.title}</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 py-2">
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
              <div className="py-2">
                <h4 className="text-md font-bold">Minimum Qualifications</h4>
                <ul className="list-disc list-inside">
                  {job.min_qualifications.map((qualification) => (
                    <li key={qualification}>{qualification}</li>
                  ))}
                </ul>
              </div>
              <Link
                className="text-blue-600 font-semibold hover:underline "
                href={`/careers/${job.id}`}
              >
                Read More
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
