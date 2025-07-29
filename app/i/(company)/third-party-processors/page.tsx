import { FULL_HOSTNAME } from "@/common/constant";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";

const title = "Third Party Processors | Cipherwill";
const description =
  "Learn how Cipherwill securely integrates with third-party processors, ensuring seamless digital asset management with top-tier encryption and privacy protection.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/i/third-party-processors`,
  },
};

const processors = [
  {
    name: "Paddle",
    service: "Payment Processing",
    location: "United States",
    privacyPolicy: "https://www.paddle.com/legal/privacy",
  },
  {
    name: "Google Cloud",
    service: "Infrastructure",
    location: "United States",
    privacyPolicy: "https://cloud.google.com/terms/cloud-privacy-notice",
  },
  {
    name: "Cloudflare",
    service: "Infrastructure",
    location: "United States",
    privacyPolicy: "https://www.cloudflare.com/en-in/privacypolicy/",
  },
  {
    name: "Vercel",
    service: "Infrastructure",
    location: "United States",
    privacyPolicy: "https://vercel.com/legal/privacy-policy",
  },
  {
    name: "Render",
    service: "Infrastructure",
    location: "United States",
    privacyPolicy: "https://render.com/privacy",
  },
  ,
  {
    name: "Digital Ocean",
    service: "Infrastructure",
    location: "United States",
    privacyPolicy: "https://www.digitalocean.com/legal/privacy-policy",
  },
  {
    name: "Aiven",
    service: "Infrastructure",
    location: "United States",
    privacyPolicy: "https://aiven.io/privacy",
  },
  {
    name: "Mixpanel",
    service: "Analytics",
    location: "United States",
    privacyPolicy: "https://mixpanel.com/legal/privacy-policy/",
  },
  {
    name: "Grphana Labs",
    service: "Monitoring",
    location: "United States",
    privacyPolicy: "https://grafana.com/legal/privacy-policy/",
  },
  {
    name: "Posthog",
    service: "Monitoring",
    location: "United States",
    privacyPolicy: "https://posthog.com/privacy",
  },
  {
    name: "Sentry",
    service: "Monitoring",
    location: "United States",
    privacyPolicy: "https://sentry.io/privacy/",
  },
];

export default function ThirdPartyProcessors() {
  return (
    <div>
      <Header />
      <section className="mt-20 py-20 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl md:text-7xl font-bold text-center">
            Third Party Processors
          </h1>
          <p className="py-6 max-w-3xl text-center">{description}</p>
        </div>
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-2">Processor</th>
              <th className="p-2">Service</th>
              <th className="p-2 hidden sm:block">Location</th>
              <th className="p-2">Privacy Policy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 ">
            {processors.map((processor, index) =>
              processor ? (
                <tr key={index}>
                  <td className="p-2">{processor.name}</td>
                  <td className="p-2">{processor.service}</td>
                  <td className="p-2 hidden sm:block">{processor.location}</td>
                  <td className="p-2">
                    <Link
                      href={processor.privacyPolicy}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </td>
                </tr>
              ) : null
            )}
          </tbody>
        </table>
      </section>
      <Footer />
    </div>
  );
}
