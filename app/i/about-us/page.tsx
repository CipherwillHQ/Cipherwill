import { FULL_HOSTNAME } from "@/common/constant";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import EncryptionDetails from "./EncryptionDetails";
import SymbolicLogo from "@/components/public/logo/SymbolicLogo";

const title = "About us";
const description =
  "Learn about our mission to protect your legacy with our encrypted platform. Manage and transfer digital assets effortlessly, ensuring your wishes are honored.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/i/about-us`,
  },
};

export default function AboutUs() {
  return (
    <div className="w-full">
      <div className="pt-12 sm:pt-40 max-w-4xl mx-auto">
        <div className="flex items-center justify-between px-4 pb-20">
          <SymbolicLogo overrideTheme="light" size={40} />
          <Link href={"/"}>
            <button className="border border-black py-2 px-6 rounded-full font-semibold">
              Go back to website
            </button>
          </Link>
        </div>
        <h1 className="text-5xl sm:text-7xl font-black p-4">about Cipherwill</h1>
      </div>
      <div className="max-w-4xl mx-auto py-10 text-justify p-4 font-medium text-lg">
        <div className="py-2">
          Learn about our mission to protect your legacy and ensure your wishes
          are honored, providing peace of mind for you and your loved ones.
        </div>

        <h2 className="text-2xl py-2 font-semibold">Our Story</h2>
        <h3 className="text-xl py-2 font-semibold">
          The Inspiration Behind Cipherwill
        </h3>
        <div>
          Cipherwill was inspired by a news story that deeply moved our founder,
          Shivam. The story was about a person who had amassed millions
          in digital assets, including cryptocurrency, domain names, and a
          thriving YouTube brand. Tragically, upon his sudden passing, his loved
          ones were unable to locate or access any of these digital assets,
          resulting in a significant loss. This poignant incident highlighted
          the urgent need for a solution to manage and secure digital legacies
          effectively. Determined to prevent others from facing such losses,
          Our team envisioned Cipherwill as a secure, user-friendly platform to
          store important digital information and ensure its seamless transfer
          to loved ones, providing peace of mind in the digital age.
        </div>
        <h3 className="text-xl py-2 font-semibold mt-4">Our Mission</h3>
        <div className="border p-4 my-2 rounded-md bg-black text-white">
          To provide a secure, user-friendly platform that empowers individuals
          to manage and transfer their digital assets with confidence and peace
          of mind.
        </div>
        <div>
          Our mission is to provide a secure, user-friendly platform that
          empowers individuals to confidently manage and transfer their digital
          assets, ensuring peace of mind. By leveraging advanced encryption
          technologies, we protect your valuable information and make it easily
          accessible to your chosen beneficiaries. We strive to offer a seamless
          experience where users can organize their assets, set up personalized
          plans, and specify their wishes in a legally sound manner, ensuring
          that their digital legacy is honored and their loved ones are cared
          for.
        </div>
        <h3 className="text-xl py-2 font-semibold mt-4">Our Vision</h3>
        <div className="border p-4 my-2 rounded-md bg-black text-white">
          To manage a billion digital wills, ensuring secure and seamless
          transfer of digital assets to loved ones around the world, creating a
          future where everyone&apos;s legacy is protected and honored.
        </div>
        <div>
          Our vision is to manage a billion digital wills, providing a secure
          and seamless transfer of digital assets to loved ones globally. We aim
          to create a future where everyone&apos;s legacy is protected and
          honored, ensuring that valuable information and assets are passed on
          with ease and security. By leveraging cutting-edge encryption and
          user-friendly design, we strive to empower individuals worldwide to
          manage their digital estates with confidence, fostering a world where
          the transition of digital legacies is a smooth and trustworthy
          process.
        </div>
        <h2 className="text-2xl py-2 font-semibold mt-4">What We Do</h2>
        <h3 className="text-xl py-2 font-semibold mt-2">Platform Overview</h3>
        <div>
          Cipherwill is a secure digital platform designed to empower
          individuals in managing and transferring their digital assets with
          confidence. Through advanced encryption technology, Cipherwill ensures
          the secure storage and seamless transfer of a wide range of assets,
          including cryptocurrencies, online accounts, intellectual property,
          and more. Users can organize their assets, create detailed plans, and
          designate beneficiaries, all while maintaining privacy and security.
          Cipherwill aims to simplify digital legacy planning, providing peace
          of mind that one&apos;s digital footprint will be managed and
          transferred according to their wishes.
        </div>

        <h3 className="text-xl py-2 font-semibold mt-2">
          Commitment to Privacy & Security
        </h3>
        <div>
          We prioritizes the privacy and security of user data. Employing
          advanced encryption technology, Cipherwill ensures that all stored
          information, including cryptocurrencies, online accounts, intellectual
          property, and more, remains inaccessible to anyone other than the
          designated user and their chosen beneficiaries. This commitment to
          encryption guarantees that even Cipherwill itself cannot access or
          view user data, thereby providing complete peace of mind that personal
          information and digital assets are securely managed and transferred
          according to the user&apos;s explicit instructions.
        </div>
        <EncryptionDetails />

        <h2 className="text-2xl py-2 font-semibold mt-4">Our Team</h2>
        <h3 className="text-xl py-2 font-semibold mt-2">Dedicated Experts</h3>
        <div>
          Our core team consists of dedicated experts who collectively ensure
          the platform&apos;s reliability and user satisfaction. They bring
          diverse expertise to uphold the highest standards of security and
          operational excellence. Led by our visionary founder, our team is
          committed to providing a secure, user-friendly platform that empowers
          individuals to manage their digital legacies with confidence and peace
          of mind.
        </div>
        <h3 className="text-xl py-2 font-semibold mt-2">Our Values</h3>
        <div>
          Our work is driven by a set of core values that guide every aspect of
          our commitment to users. We prioritize integrity, ensuring
          transparency and honesty in all our interactions. Security is
          paramount, underpinned by cutting-edge encryption technologies that
          safeguard user data with the highest standards of protection. We value
          user empowerment, aiming to provide a platform that empowers
          individuals to manage and transfer their digital assets with
          confidence and ease. Innovation fuels our continuous improvement, as
          we strive to integrate the latest technological advancements to
          enhance user experience and security measures. Ultimately, we are
          dedicated to reliability and trustworthiness, ensuring that our
          platform remains a dependable partner in managing and preserving
          digital legacies for generations to come.
        </div>
        <h2 className="text-2xl py-2 font-semibold mt-4">Join Us</h2>
        <h3 className="text-xl py-2 font-semibold mt-2">Become a User</h3>
        <div>
          Ready to secure your digital legacy with confidence? Join Cipherwill
          today and start managing your digital assets with ease and peace of
          mind. Whether you have cryptocurrencies, online accounts, intellectual
          property, or other valuable assets, our platform offers robust
          security through advanced encryption technologies. Take control of
          your digital future by organizing your assets, setting up personalized
          plans, and designating beneficiaries securely. Join our community of
          users who trust Cipherwill to safeguard their digital legacies and
          ensure their wishes are honored. Sign up now and experience the peace
          of mind that comes with knowing your digital assets are in safe hands.
        </div>
        <Link href={"/app"}>
          <div className="my-4 border rounded-md bg-black text-white p-2 text-center">
            Get Started as User
          </div>
        </Link>
        <h3 className="text-xl py-2 font-semibold mt-2">
          Career Opportunities
        </h3>
        <div>
          Interested in joining a dynamic team at the forefront of digital
          legacy management? Cipherwill is currently seeking talented
          individuals to join us in our mission to revolutionize how individuals
          manage and transfer their digital assets securely. We have
          opportunities across various roles, from technology and cybersecurity
          experts to legal and customer support professionals. If you are
          passionate about technology, dedicated to enhancing security
          standards, and committed to empowering individuals through innovative
          solutions, explore our career opportunities today. Join Cipherwill and
          contribute to shaping the future of digital legacy management while
          advancing your career in a supportive and forward-thinking
          environment.
        </div>
      </div>
      <Footer />
    </div>
  );
}
