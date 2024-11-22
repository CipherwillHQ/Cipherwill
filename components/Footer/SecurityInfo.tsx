import Link from "next/link";
import { TbLock, TbLockBolt } from "react-icons/tb";

const common_style = "text-blue-600 hover:text-blue-700 transition-colors";

export default function SecurityInfo() {
  return (
    <div className="">
      <div className="py-2 flex items-center gap-2 my-2">
        <TbLockBolt className="text-blue-600" size={23} />
        <div className="font-semibold">Your data is secured with</div>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-neutral-300">
        <Link
          href={"https://en.wikipedia.org/wiki/Advanced_Encryption_Standard"}
          className={`${common_style}`}
        >
          <div>256-bit AES Encryption</div>
        </Link>
        &bull;
        <Link
          href={"https://en.wikipedia.org/wiki/Zero-knowledge_proof"}
          className={`${common_style}`}
        >
          <div>Zero Knowledge Proofs</div>
        </Link>
        &bull;
        <div>
          <Link
            href={"https://en.wikipedia.org/wiki/Elliptic-curve_cryptography"}
            className={`${common_style} mr-1`}
          >
            Elliptic Curve Cryptography
          </Link>
          (
          <Link
            href={"https://hackmd.io/@benjaminion/bls12-381"}
            className={`${common_style} mr-1`}
          >
            BLS12-381
          </Link>
          &
          <Link
            href={"https://en.bitcoin.it/wiki/Secp256k1"}
            className={`${common_style} mx-1`}
          >
            SECP256K1
          </Link>
          Curves)
        </div>
        &bull;
        <Link
          href={"https://en.wikipedia.org/wiki/One-time_pad"}
          className={`${common_style}`}
        >
          <div>One Time Pad Encryption</div>
        </Link>
        &bull;
        <div>
          <Link
            href={"https://en.wikipedia.org/wiki/Lattice-based_cryptography"}
            className={`${common_style} mr-1`}
          >
            Lattice based Encryption
          </Link>
          (
          <Link
            href={"https://pq-crystals.org/kyber/"}
            className={`${common_style}`}
          >
            CRYSTALS-KYBER
          </Link>
          )
        </div>
      </div>
    </div>
  );
}
