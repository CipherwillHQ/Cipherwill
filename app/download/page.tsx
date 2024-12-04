import { FULL_HOSTNAME } from "@/common/constant";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import InstallButton from "./InstallButton";
import Link from "next/link";

const title = "Cipherwill downloads";
const description =
  "Learn how to easily add Cipherwill as an app on iOS, Android, Windows, and Mac. Also, some extra content that might be useful.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/download`,
  },
};

export default function Download() {
  return (
    <div className="w-full overflow-hidden">
      <Header />
      <section className="text-center pt-20 my-24 p-4 font-medium text-lg">
        <h1 className="text-3xl font-bold sm:text-4xl xl:text-5xl">
          Install Cipherwill
        </h1>
        <p className="mt-8 text-base sm:text-lg max-w-xl mx-auto">
          {description}
        </p>

        <InstallButton />

        <div className="mt-8 p-2 w-full max-w-xl mx-auto ">
          <h2 className="font-bold text-xl pt-4">On Mobile Devices</h2>
          <p className="text-lg pt-1 pb-4">IOS & Android</p>
          <ol className="text-start">
            <li>
              1. Click on options menu in the top right corner of the screen.
            </li>
            <li>
              2. Tap the <b>Add to Home Screen</b> button.
            </li>
            <li>3. Tap the Add/Install button.</li>
          </ol>
        </div>

        <div className="mt-10 p-2 w-full max-w-xl mx-auto border-t">
          <h2 className="font-bold text-xl pt-4">On Desktop Devices</h2>
          <p className="text-lg pt-1 pb-4">any desktop browser</p>
          <ol className="text-start">
            <li>
              1. Click on install button in the search bar, near the bookmark
              icon.
            </li>
            <li>
              2. Click on the <b>Install</b> button.
            </li>
          </ol>
        </div>

        <div className="mt-10 p-2 w-full max-w-xl mx-auto border-t">
          <h2 className="font-bold text-xl pt-4">Browser Extensiomn</h2>
          <p className="text-lg pt-1">any desktop browser</p>
          <div className="py-6 text-left">
            Cipherwill&apos;s browser extension functions as a Dead Man&apos;s Switch,
            reminding you to update your cipherwill.
          </div>
          <Link
            href={
              "https://chromewebstore.google.com/detail/cipherwill-dead-mans-swit/nfjmbmpjnjlpjaamaofmnmdkjndgcfap"
            }
            target="_blank"
            className="bg-black py-2 px-8 text-white rounded-md"
          >
            Download here
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
