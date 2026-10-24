// Presents Cipherwill downloads and platform availability.
// Owns download metadata and installation guidance, not the install prompt behavior.
import { FULL_HOSTNAME } from "@/common/constant";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import InstallButton from "./InstallButton";
import Link from "next/link";

const title = "Cipherwill downloads";
const description =
  "Download Cipherwill for Android or install it from your browser on iOS, Android, Windows, and Mac.";

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
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-lg pb-4">Android</h3>
              <Link
                href="https://play.google.com/store/apps/details?id=com.cipherwill.app"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-primary-700 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Get it on Google Play
              </Link>
            </div>
            <div>
              <h3 className="text-lg pb-4">iOS</h3>
              <p className="text-base text-neutral-500">Coming soon</p>
            </div>
          </div>
          <h3 className="font-bold text-lg mt-8">Install from your browser</h3>
          <p className="text-lg pt-1 pb-4">iOS & Android</p>
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
      </section>

      <Footer />
    </div>
  );
}
