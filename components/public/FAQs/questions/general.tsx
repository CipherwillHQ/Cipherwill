import Link from "next/link";
import { BiQuestionMark } from "react-icons/bi";

const name = "General";
const questions = [
  {
    icon: <BiQuestionMark />,
    title: "What is Cipherwill?",
    slug: "what-is-cipherwill",
    description:
      "Cipherwill is a secure digital platform for storing important information and creating electronic wills. It ensures that your digital assets are passed on to your chosen beneficiaries after you pass away.",
    content: (
      <div>
        Secure platform for storing important information and creating
        electronic wills. It ensures your digital assets, like bank accounts and
        investments, are passed to your chosen beneficiaries.
        <br />
        <br />
        Cipherwill is a dead man&apos;s switch to that ensures your assets are passed
        on securely. If you don&apos;t update your will within a set time, the system
        assumes you&apos;re unavailable. It then automatically delivers your
        encrypted information to your beneficiaries, ensuring nothing gets lost.
        <br />
        <br />
        This switch acts as a safeguard, preventing your assets from being
        locked away forever. By using this feature, you can have peace of mind
        knowing your loved ones will receive what’s important when it matters
        most.
      </div>
    ),
  },
  {
    icon: <BiQuestionMark />,
    title: "How does Cipherwill protect my data?",
    slug: "how-does-cipherwill-protect-my-data",
    description:
      "Cipherwill uses advanced end-to-end encryption to secure your data. This means that only you and your designated beneficiaries can access your information.",
    content: (
      <div>
        Cipherwill protects your data using advanced encryption methods,
        including 256 bit AES encryption, making it virtually impossible to
        crack.
        <br />
        <br />
        Your data is first encrypted with a time capsule key, then re-encrypted
        with your beneficiary&apos;s public key for double protection. The system
        also uses secure key exchange algorithms and future-proof encryption
        like Lattice-based cryptography to ensure long-term security.
        <br />
        <br />
        <Link
          href={`/how-it-works`}
          className="text-blue-500 hover:underline font-semibold"
        >
          Read "How Cipherwill Works?" here
        </Link>
      </div>
    ),
  },
  {
    icon: <BiQuestionMark />,
    title: "What kind of information can I store on Cipherwill?",
    slug: "what-kind-of-information-can-i-store-on-cipherwill",
    description:
      "You can store a wide range of digital and physical assets, including bank details, cryptocurrency wallets, legal documents, social media accounts, and more.",
    content: (
      <div>
        You can store a wide range of information on Cipherwill, including:
        <br />
        <br />
        <ul>
          <li>
            <strong>Financial assets</strong>: bank accounts, payment cards,
            crypto staking, seed phrases, and investments.
          </li>
          <li>
            <strong>Digital accounts</strong>: email, social media, payment
            apps, and password managers.
          </li>
          <li>
            <strong>Security info</strong>: device locks (phone, laptop),
            recovery keys, and encryption keys.
          </li>
          <li>
            <strong>Legal and personal documents</strong>: wills, health
            directives, property deeds, and personal notes.
          </li>
          <li>
            <strong>File storage</strong>: any file type, including photos,
            videos, PDFs, and more.
          </li>
        </ul>
        <br />
        <br />
        This ensures all your important data is securely stored in one place for
        easy transfer to your beneficiaries.
        <br />
        <br />
        <Link
          href={`/app/segments`}
          className="text-blue-500 hover:underline font-semibold"
        >
          Explore all data segments here
        </Link>
      </div>
    ),
  },
  {
    icon: <BiQuestionMark />,
    slug: "how-does-cipherwill-work-after-i-pass-away",
    title: "How does Cipherwill work after I pass away?",
    description:
      "After you pass away, if your will is not updated within a predefined time, Cipherwill automatically delivers your stored data to the beneficiaries you designated.",
    content: (
      <div>
        After you pass away, Cipherwill triggers its <b>Will Execution</b> if
        you haven&apos;t updated your will within the specified time.
        <br />
        <br />
        At that point, your encrypted data is automatically sent to your
        beneficiaries. They can only access it by decrypting it with their
        private key (Security factors active on their Cipherwill Account),
        ensuring that only the right people can view your information.
        <br />
        <br />
        This system ensures that your important assets and information are
        securely transferred to your loved ones without any complications.
        <br />
        <br />
        <Link
          href={`/i/how-execution-timeline-works`}
          className="text-blue-500 hover:underline font-semibold"
        >
          See How Cipherwill securely executes your digital will
        </Link>
      </div>
    ),
  },
  {
    icon: <BiQuestionMark />,
    slug: "is-cipherwill-accessible-to-my-beneficiaries-without-my-consent",
    title: "Is Cipherwill accessible to my beneficiaries without my consent?",
    description:
      "No, your data remains secure and accessible only to you until the predefined time passes after your death, ensuring that your beneficiaries receive it at the right time.",
    content: (
      <div>
        No, Your data is not accessible to your beneficiaries without your
        consent or triggering Will execution.
        <br />
        <br />
        Cipherwill uses{" "}
        <Link href="/i/time-capsule-encryption" className="underline">
          time capsule encryption
        </Link>
        , which automatically releases your encrypted data to your beneficiaries
        after a predefined time if you haven&apos;t updated your will. They can
        access it securely using their decryption keys, ensuring your
        information is released to them without requiring your direct consent at
        that moment.
        <br />
        <br />
        This system guarantees that your data is securely and automatically
        delivered to the right people when needed.
        <br />
        <br />
        <Link
          href={`/i/time-capsule-encryption`}
          className="text-blue-500 hover:underline font-semibold"
        >
          See Cipherwill&apos;s "Timed-release encryption"
        </Link>
      </div>
    ),
  },
  {
    icon: <BiQuestionMark />,
    slug: "can-i-update-my-will-and-information-stored-on-cipherwill",
    title: "Can I update my will and information stored on Cipherwill?",
    description:
      "Yes, you can update your will and any stored information at any time to reflect changes in your assets, beneficiaries, or wishes.",
    content:
      "Yes, you can update your will and any stored information at any time to reflect changes in your assets, beneficiaries, or wishes.",
  },
  {
    icon: <BiQuestionMark />,
    slug: "what-happens-if-my-beneficiaries-cannot-access-my-data",
    title: "What happens if my beneficiaries cannot access my data?",
    description:
      "If beneficiaries cannot access your data, Cipherwill’s team will personally reach out to them or their trusted contacts to ensure the data is delivered securely.",
    content: (
      <div>
        If your beneficiaries cannot access your data, Cipherwill’s team will
        personally reach out to them or their trusted contacts.
        <br />
        <br />
        The team will work to ensure that the data is securely delivered and
        accessible, so your beneficiaries can receive the information they need
        without delay. This extra step ensures that your legacy is protected and
        transferred to the right people, even if there are issues accessing the
        data.
      </div>
    ),
  },
  {
    icon: <BiQuestionMark />,
    slug: "how-much-digital-storage-does-cipherwill-provide",
    title: "How much digital storage does Cipherwill provide?",
    description:
      "Cipherwill provides 1GB of digital storage with premium plan for your important files, photos, videos, and other documents that you wish to include in your will.",
    content: (
      <div>
        Cipherwill provides 1GB of digital storage with premium plan for your
        important files, photos, videos, and other documents that you wish to
        include in your will.
        <br />
        <br />
        <Link
          href={`/pricing`}
          className="text-blue-500 hover:underline font-semibold"
        >
          See Pricing for details
        </Link>
      </div>
    ),
  },
  {
    icon: <BiQuestionMark />,
    slug: "who-should-use-cipherwill",
    title: "Who should use Cipherwill?",
    description:
      "Cipherwill is ideal for anyone who has digital assets or online accounts that they want to securely pass on to their loved ones after they pass away.",
    content: (
      <div>
        Cipherwill is ideal for anyone who wants to securely store and transfer
        their important information after they pass away.
        <br />
        <br />
        This includes individuals with digital assets like cryptocurrency,
        social media profiles, online accounts, or important financial and legal
        documents. It&apos;s also perfect for people with significant real-world
        assets, such as property or business interests, who want to ensure their
        legacy is protected.
        <br />
        <br />
        If you care about your loved ones having access to your data and assets
        in a secure, organized way, Cipherwill is for you.
      </div>
    ),
  },
  {
    icon: <BiQuestionMark />,
    slug: "how-do-i-get-started-with-cipherwill",
    title: "How do I get started with Cipherwill?",
    description:
      "To get started with Cipherwill, simply sign up on the platform, securely store your information, and create your digital will. You can update it at any time to ensure your assets are passed on as you wish.",
    content: (
      <div>
        To get started with Cipherwill, simply sign up on the platform, securely
        store your information, and create your digital will. You can update it
        at any time to ensure your assets are passed on as you wish.
        <br />
        <br />
        <Link
          href={"/app"}
          className="border rounded-md py-2 px-4 text-sm font-semibold hover:bg-slate-100"
        >
          Get Started Now
        </Link>
      </div>
    ),
  },
];

export { name, questions };
