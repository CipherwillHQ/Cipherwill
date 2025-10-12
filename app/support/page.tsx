import { FULL_HOSTNAME } from "@/common/constant";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import ContactForm from "./ContactForm";
import CTA from "@/components/public/CTA";
import FAQs from "@/components/public/FAQs";
import SmoothPageScroll from "@/components/animated/SmoothPageScroll";

const title = "Cipherwill Help Center";
const description =
  "Our support and help desk for FAQs, tutorials, and customer support. We help you with your digital estate planning and your satisfaction is our priority.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/support`,
  },
};

export default function Support() {
  return (
    <div className="w-full">
      <SmoothPageScroll/>
      <Header />
      <ContactForm />
      <FAQs/>
      <CTA />
      <Footer />
    </div>
  );
}
