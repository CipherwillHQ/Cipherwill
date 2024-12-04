import { FULL_HOSTNAME } from "@/common/constant";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import { FaRegArrowAltCircleUp } from "react-icons/fa";

const title = "Live Status | Cipherwill";
const description =
  "Stay updated with real-time server and service status. Monitor performance, uptime, and maintenance updates to ensure seamless access to all Cipherwill services.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/i/live-status`,
  },
};

export default async function LiveStatus() {
  let data = await fetch("https://api.cipherwill.com/rest/v1/live-status");
  let status = await data.json();

  return (
    <div>
      <Header />
      <section className="mt-20 py-20 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl md:text-7xl font-bold text-center">
            Live Status
          </h1>
          <p className="py-6 max-w-3xl text-center">{description}</p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Clients</h2>
          <div className="flex flex-col gap-2 py-4">
            {status.clients.map((client, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <h3>{client.name}</h3>
                  <Link
                    href={client.url}
                    target="_blank"
                    className="hover:underline text-blue-600 font-medium text-sm"
                    rel="noreferrer"
                  >
                    {client.url}
                  </Link>
                </div>
                {client.status ? (
                  <div className="text-green-700 flex items-center gap-2 font-semibold">
                    <FaRegArrowAltCircleUp />
                    <span>UP</span>
                  </div>
                ) : (
                  <div className="text-red-700 flex items-center gap-2 font-semibold">
                    <FaRegArrowAltCircleUp className="rotate-180" />
                    <span>DOWN</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Backend APIs</h2>
          <div>
            {status.backends.map((backend, index) => (
              <div key={backend.name} className="flex justify-between">
                <div>{backend.name}</div>
                {backend.status ? (
                  <div className="text-green-700 flex items-center gap-2 font-semibold">
                    <FaRegArrowAltCircleUp />
                    <span>UP</span>
                  </div>
                ) : (
                  <div className="text-red-700 flex items-center gap-2 font-semibold">
                    <FaRegArrowAltCircleUp className="rotate-180" />
                    <span>DOWN</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="py-8">
          <h2 className="text-2xl font-semibold">Database</h2>
          <div className="flex items-center justify-evenly gap-1 md:gap-2">
            {status.database[0].map((db, index) => (
              <div
                key={db.date}
                className={`h-40 w-full ${
                  db.status ? "bg-green-500" : "bg-red-500"
                } last:animate-pulse rounded`}
              />
            ))}
          </div>
        </div>
        <div className="py-8">
          <h2 className="text-2xl font-semibold">Object Storage</h2>
          <div className="flex items-center justify-evenly gap-1 md:gap-2">
            {status.storage[0].map((db, index) => (
              <div
                key={db.date}
                className={`h-40 w-full ${
                  db.status ? "bg-green-500" : "bg-red-500"
                } last:animate-pulse rounded`}
              />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
