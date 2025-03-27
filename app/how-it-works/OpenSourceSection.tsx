import Link from "next/link";
import { LuGithub } from "react-icons/lu";
import open_src_bg from "./open_souce_bg.jpeg";
import Image from "next/image";

export default function OpenSourceSection() {
  return (
    <section className="px-6">
      <div className="relative py-24 my-12 px-4 text-white w-full max-w-7xl mx-auto rounded-3xl overflow-hidden">
        <Image
          src={open_src_bg}
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          quality={50}
          placeholder="blur"
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/80 to-black/60"></div>

        <div className="text-center flex flex-col items-center relative">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center font-playfair italic whitespace-pre-line">
            Open Source & Transparent
          </h2>
          <div className="py-12 max-w-2xl text-lg">
            Cipherwill has open sourced all it&apos;s client code, this ensures
            that the community can verify how Cipherwill is encrypting the data
            before uploading to cloud and that no one has access to your data
            not even Cipherwill.
          </div>
          <Link
            href={"https://github.com/CipherwillHQ/cipherwill"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="bg-white text-black px-4 py-2 rounded-full flex flex-row items-center hover:cursor-pointer">
              <LuGithub />
              <span className="ml-2">Visit Github</span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
