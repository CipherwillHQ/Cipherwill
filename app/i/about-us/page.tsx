import { FULL_HOSTNAME } from "@/common/constant";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import EncryptionDetails from "./EncryptionDetails";
import SymbolicLogo from "@/components/public/logo/SymbolicLogo";
import { IoIosHeart } from "react-icons/io";

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
        <div className="flex flex-col md:flex-row items-center justify-between px-4 pb-8">
          <div className="flex grow flex-col gap-2">
            <SymbolicLogo overrideTheme="light" size={40} />
            <h3 className="font-semibold text-xl flex items-center gap-2">
              Developed with <IoIosHeart className="text-red-600" />
              by
            </h3>
            <div>
              Zetapad Technologies Inc.
              <br />
              <div className="text-sm">
                registered in the U.S. and other countries.
                <br />
                Cipherwill is developed by a team of engineers, lawyers,
                designers and security experts.
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full sm:w-fit sm:max-w-fit pt-8 gap-2 text-sm">
            <Link href={"/"}>
              <button className="font-medium shadow-sm hover:shadow-md transition-all border border-gray-100 py-2 px-4 rounded-full w-full">
                Go back to website
              </button>
            </Link>
            <Link href={"/i/live-status"}>
              <button className="font-medium shadow-sm hover:shadow-md transition-all border border-gray-100 py-2 px-4 rounded-full w-full">
                Servers & Status
              </button>
            </Link>

            <Link href={"/i/third-party-processors"}>
              <button className="font-medium shadow-sm hover:shadow-md transition-all border border-gray-100 py-2 px-4 rounded-full w-full">
                Third Party Processors
              </button>
            </Link>
          </div>
        </div>
        <div className="w-full bg-gradient-to-b from-transparent to-black/5 border-b border-black/20 rounded-b-full h-8"></div>
        <h1 className="text-5xl sm:text-7xl font-black p-4 mt-12">
          about Cipherwill
        </h1>
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
          Shivam. A man had millions in digital assets, including
          cryptocurrency, domain names, and a YouTube brand. After his sudden
          passing, his loved ones couldn&apos;t access these assets, resulting
          in a significant loss.
          <br />
          <br />
          This incident highlighted the urgent need for managing digital
          legacies. Determined to prevent such losses, our team envisioned
          Cipherwill. It’s a secure, user-friendly platform to store important
          digital information and ensure its seamless transfer to loved ones.
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
          Cipherwill is a secure digital platform that helps individuals manage
          and transfer their digital assets with confidence. It uses advanced
          encryption technology to ensure the safe storage and seamless transfer
          of various assets, such as cryptocurrencies, online accounts, and
          intellectual property.
          <br /> <br />
          Users can organize their assets, create detailed plans, and designate
          beneficiaries while maintaining privacy and security. Cipherwill
          simplifies digital legacy planning, offering peace of mind that your
          digital footprint will be handled according to your wishes.
        </div>

        <h3 className="text-xl py-2 font-semibold mt-2">
          Commitment to Privacy & Security
        </h3>
        <div>
          We prioritize the privacy and security of user data by employing
          advanced encryption technology. This ensures that all stored
          information, including cryptocurrencies, online accounts, and
          intellectual property, remains accessible only to the user and their
          chosen beneficiaries.
          <br />
          <br />
          Cipherwill&apos;s encryption is so robust that even our team cannot
          access or view user data. This commitment provides complete peace of
          mind, ensuring personal information and digital assets are securely
          managed and transferred according to the user&apos;s explicit
          instructions.
        </div>
        <EncryptionDetails />

        <h2 className="text-2xl py-2 font-semibold mt-4">Our Team</h2>
        <h3 className="text-xl py-2 font-semibold mt-2">Dedicated Experts</h3>
        <div>
          Our core team consists of dedicated experts who collectively ensure
          the platform&apos;s reliability and user satisfaction. They bring
          diverse expertise to uphold the highest standards of security and
          operational excellence. Led by our founder, our team is committed to
          providing a secure, user-friendly platform that empowers individuals
          to manage their digital legacies with confidence and peace of mind.
        </div>
        <h3 className="text-xl py-2 font-semibold mt-2">Our Values</h3>
        <div>
          <b>Integrity:</b> We prioritize transparency and honesty in all
          interactions, ensuring trust with our users. <br />
          <b>Security:</b> Our cutting-edge encryption technologies safeguard
          user data with the highest standards of protection. <br />
          <b>User Empowerment:</b> We aim to provide a platform that empowers
          individuals to manage and transfer their digital assets with
          confidence and ease. <br />
          <b>Innovation:</b> Continuous improvement drives us to integrate the
          latest technological advancements for enhanced user experience and
          security. <br />
          <b>Reliability & Trustworthiness:</b> We are dedicated to being a
          dependable partner in managing and preserving digital legacies for
          generations to come.
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
          <br />
          <Link
            href={"/app"}
            className="text-blue-500 hover:underline font-semibold"
          >
            Get Started as User
          </Link>
        </div>

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
          <br />
          <Link
            href={"/careers"}
            className="text-blue-500 hover:underline font-semibold"
          >
            Learn about current job openings.
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
