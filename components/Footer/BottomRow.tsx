import Link from "next/link";
import { TbLockBolt } from "react-icons/tb";

const link_style =
  "text-cream/70 hover:text-cream underline underline-offset-4 decoration-cream/20 hover:decoration-cream/50 transition-colors";

export default function BottomRow() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-end gap-8 lg:gap-12">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TbLockBolt className="text-sage" size={20} />
          <div className="text-base font-semibold text-cream">
            Your data is secured with
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm">
          <Link
            href="https://en.wikipedia.org/wiki/Advanced_Encryption_Standard"
            className={link_style}
          >
            256-bit AES Encryption
          </Link>
          &bull;
          <Link
            href="https://en.wikipedia.org/wiki/Zero-knowledge_proof"
            className={link_style}
          >
            Zero Knowledge Proofs
          </Link>
          &bull;
          <span>
            <Link
              href="https://en.wikipedia.org/wiki/Elliptic-curve_cryptography"
              className={link_style}
            >
              Elliptic Curve Cryptography
            </Link>
            <span className="text-cream/40">
              {" "}
              (
              <Link
                href="https://hackmd.io/@benjaminion/bls12-381"
                className={link_style}
              >
                BLS12-381
              </Link>
              {" "}&amp;{" "}
              <Link
                href="https://en.bitcoin.it/wiki/Secp256k1"
                className={link_style}
              >
                SECP256K1
              </Link>
              {" "}Curves)
            </span>
          </span>
          &bull;
          <Link
            href="https://en.wikipedia.org/wiki/One-time_pad"
            className={link_style}
          >
            One Time Pad Encryption
          </Link>
          &bull;
          <span>
            <Link
              href="https://en.wikipedia.org/wiki/Lattice-based_cryptography"
              className={link_style}
            >
              Lattice based Encryption
            </Link>
            <span className="text-cream/40">
              {" "}
              (
              <Link
                href="https://pq-crystals.org/kyber/"
                className={link_style}
              >
                CRYSTALS-KYBER
              </Link>
              )
            </span>
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-end space-y-3">
        <div className="flex flex-wrap gap-x-4 gap-y-2 lg:justify-end text-base">
          <Link
            href="/i/terms-of-service"
            className="text-cream/70 hover:text-cream underline underline-offset-4 decoration-cream/30 hover:decoration-cream/60 transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="/i/privacy-policy"
            className="text-cream/70 hover:text-cream underline underline-offset-4 decoration-cream/30 hover:decoration-cream/60 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/i/cookie-policy"
            className="text-cream/70 hover:text-cream underline underline-offset-4 decoration-cream/30 hover:decoration-cream/60 transition-colors"
          >
            Accessibility
          </Link>
        </div>
        <p className="text-base text-cream/50 lg:text-right">
          &copy; {new Date().getFullYear()} Zetapad Technologies. All rights
          reserved.
        </p>
      </div>
    </div>
  );
}
