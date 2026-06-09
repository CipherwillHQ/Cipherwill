import Link from "next/link";
import { BiLogoGithub, BiLogoYoutube, BiSupport } from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/CipherwillHQ/Cipherwill",
    icon: BiLogoGithub,
  },
  {
    label: "X (Twitter)",
    href: "https://x.com/CipherwillHQ",
    icon: FaXTwitter,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@CipherwillHQ",
    icon: BiLogoYoutube,
    accent: true,
  },
  {
    label: "Email support",
    href: "mailto:support@cipherwill.com",
    icon: BiSupport,
  },
];

export default function SocialRow() {
  return (
    <ul className="flex items-center gap-3">
      {socials.map(({ label, href, icon: Icon, accent }) => (
        <li key={label}>
          <Link
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className={`flex items-center justify-center w-11 h-11 rounded-full border border-cream/25 transition-all duration-200 ${
              accent
                ? "text-red-500 hover:border-cream/40 hover:text-red-400"
                : "text-cream/70 hover:text-cream hover:border-cream/40"
            }`}
          >
            <Icon size={20} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
