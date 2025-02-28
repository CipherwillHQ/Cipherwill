import Link from "next/link";
import { LuGithub } from "react-icons/lu";

export default function OpenSourceSection() {
  return (
    <section className="my-20 px-4">
      <div className="bg-black text-white rounded-3xl w-full max-w-7xl mx-auto px-4 py-24 text-center flex flex-col items-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center font-playfair italic whitespace-pre-line">
          Open Source & Transparent
        </h2>
        <div className="py-12 max-w-2xl">
          Cipherwill has open sourced all it&apos;s client code, this ensures
          that the community can verify how cipherwill is encrypting the data
          before uploading to cloud and that no one has access to your data not
          even cipherwill
        </div>
        <Link
          href={"https://github.com/CipherwillHQ/cipherwill"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="bg-white text-black px-4 py-2 rounded-full flex flex-row items-center">
            <LuGithub />
            <span className="ml-2">Visit Github</span>
          </button>
        </Link>
      </div>
    </section>
  );
}
