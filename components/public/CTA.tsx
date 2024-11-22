import Link from "next/link";
import SimpleButton from "../common/SimpleButton";
import bitmoji from "@/assets/emoji/bitmoji.webp";
import Image from "next/image";

export default function CTA() {
  return (
    <div
    className="p-4"
    >
      <div className="relative flex flex-col md:flex-row w-full max-w-7xl mx-auto px-2 py-20 my-8 bg-purple-100 rounded-xl">
      <div className="p-8 flex flex-col gap-4 w-full md:w-2/3">
        <h2 className={`text-6xl font-black italic text-center md:text-left py-4 font-playfair`}>
          Your Digital Will
        </h2>
        <div className="pl-2 text-lg text-center md:text-left font-medium">
          Does your family know where you keep your
          <Image
            src={bitmoji}
            alt="bitmoji"
            width={20}
            height={20}
            className="inline-block mx-2"
          />
          bitcoins or will they be lost forever?
          <br />
          Make sure they reach right people if you unexpectedly pass away.
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 w-full md:w-1/3">
        <Link href={"/app"}>
          <SimpleButton>Sign up with Cipherwill</SimpleButton>
        </Link>
        <Link href={"/"} className="hover:underline text-sm font-medium">
          Learn more about Cipherwill
        </Link>
      </div>
    </div>
    </div>
  );
}
