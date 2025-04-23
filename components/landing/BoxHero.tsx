import { BiRightArrowAlt } from "react-icons/bi";
import SimpleButton from "../common/SimpleButton";
import Link from "next/link";

export default function BoxHero() {
  return (
    <section className="pt-40 pb-10 max-w-7xl w-full mx-auto p-4">
      <div className="bg-[#F9F9F9] px-4 py-20 flex flex-col items-center gap-14 rounded-4xl">
        <h1 className="text-5xl md:text-7xl font-extrabold text-center">Encrypted Dead Man&apos;s Switch</h1>
        <p className="text-xl max-w-3xl text-center">
          When you pass away, we make sure your data (such as bank details,
          investments, properties, digital assets, etc.) get's to the right people.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <SimpleButton
            className="flex items-center gap-2 hover:cursor-pointer hover:gap-3 transition-all duration-200 ease-in-out rounded-full px-8 py-2"
            href="/app"
          >
            <span>Get Started </span>
            <BiRightArrowAlt />
          </SimpleButton>
          <Link href={"/how-it-works"}>
            <button className="py-2 px-8 font-semibold hover:underline hover:cursor-pointer">
              Learn How it works
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
