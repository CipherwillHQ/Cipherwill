import Link from "next/link";

export function WorksMenuDesktop() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <Link href={"/how-it-works"}>
        <div className="w-80 hover:bg-orange-100 rounded-md p-4">
          <div className="font-semibold text-lg">Platform Overview</div>
          <div className="text-sm">
            How it works in simple words or view detailed platform working
            details including encryption
          </div>
        </div>
      </Link>
      <Link href={"/i/how-execution-timeline-works"}>
        <div className="w-80 hover:bg-orange-100 rounded-md p-4">
          <div className="font-semibold text-lg">Will Execution</div>
          <div className="text-sm">
            How Cipherwill securely executes your digital will upon predefined
            triggers
          </div>
        </div>
      </Link>
      <Link href={"/how-factors-work"}>
        <div className="w-80 hover:bg-orange-100 rounded-md p-4">
          <div className="font-semibold text-lg">Security Factors</div>
          <div className="text-sm">
            These factors act as safeguards, encrypting your data to protect it
          </div>
        </div>
      </Link>
      <Link href={"/i/commutative-encryption"}>
        <div className="w-80 hover:bg-orange-100 rounded-md p-4">
          <div className="font-semibold text-lg">Encryption Layers</div>
          <div className="text-sm">
          Breaks down Cipherwill's Implementation of Commutative Encryption
          </div>
        </div>
      </Link>
      <Link href={"/i/time-capsule-encryption"}>
        <div className="w-80 hover:bg-orange-100 rounded-md p-4">
          <div className="font-semibold text-lg">Time Capsule Encryption</div>
          <div className="text-sm">
          Understand Time Based Encryption Used in Cipherwill
          </div>
        </div>
      </Link>
    </div>
  );
}

export function WorksMenuMobile() {
  return (
    <div className="p-2 flex flex-col gap-2 font-medium">
      <Link href={"/how-it-works"}>Platform Overview</Link>
      <Link href={"/i/how-execution-timeline-works"}>Will Execution</Link>
      <Link href={"/how-factors-work"}>Security Factors</Link>
      <Link href={"/i/commutative-encryption"}>Encryption Layers</Link>
      <Link href={"/i/time-capsule-encryption"}>Time Capsule Encryption</Link>
    </div>
  );
}
