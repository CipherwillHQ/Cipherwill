import SimpleButton from "@/components/common/SimpleButton";
import Link from "next/link";

export default function PillarGrid() {
  return (
    <div
      className="flex flex-col md:flex-row w-full max-w-7xl mx-auto gap-2 pt-12 md:pt-0 md:py-4 md:-mt-8
    text-white
    "
    >
      <div className="flex flex-col w-full gap-2">
        <div className="bg-gradient-to-bl from-red-900 to-red-950 p-2 rounded-lg">
          <div className="text-white/50">We use </div>
          <h2 className="font-bold text-xl pb-2">E2E Encryption</h2>
          <div className="text-white/50">
            Your data is fully secure - even Cipherwill can&apos;t access it. Every
            piece of information is encrypted on your device before it ever
            leaves.
          </div>
        </div>
        <div className="bg-gradient-to-bl from-orange-900 to-orange-950 p-2 rounded-lg">
          <div>We aim to protect</div>
          <div className="font-bold text-xl">Digital Legacies Globally</div>
        </div>
      </div>
      <div className="w-full bg-gradient-to-b from-yellow-900 to-yellow-950 md:mt-24 p-2 rounded-lg">
        <h2 className="font-bold text-3xl pb-2">
          $200B <span className="text-xl">in lost bitcoins</span>
        </h2>
        <div className="text-white/50">
          According to estimates offered by ReWallet, as much as 20% of the
          bitcoin supply inactive and trapped in lost wallets.
        </div>
        <Link
          target="_blank"
          className="underline text-white/50"
          href={
            "https://www.nytimes.com/2021/01/12/technology/bitcoin-passwords-wallets-fortunes.html"
          }
        >
          Source
        </Link>
      </div>
      <div className="flex flex-col justify-evenly w-full bg-orange-950 md:mt-40 p-2 rounded-lg text-center">
        <div>
          Join <b>thousands of people</b> who have secured their digital assets
          with Cipherwill.
        </div>
        <SimpleButton
          href="/app"
          className="w-full py-2 mt-2 bg-white text-black hover:bg-neutral-200 font-bold"
        >
          Get Started
        </SimpleButton>
      </div>
      <div className="w-full bg-gradient-to-b from-indigo-600 to-indigo-700 md:mt-24 p-2 rounded-lg">
        <div className="text-white/50">Average person have </div>
        <h2 className="font-bold text-3xl pb-2">
          168 <span className="text-xl">Passwords</span>
        </h2>

        <div className="text-white/50">
          Without proper planning, countless accounts and assets could become
          inaccessible to loved ones.
        </div>
        <Link
          target="_blank"
          className="underline text-white/50"
          href={
            "https://nordpass.com/blog/how-many-passwords-does-average-person-have/"
          }
        >
          Source
        </Link>
      </div>
      <div className="flex flex-col w-full gap-2">
        <div className="bg-gradient-to-br from-green-900 to-green-950 p-2 rounded-lg">
          <h2 className="font-bold text-xl pb-2">Carl said:</h2>
          <div className="text-white/50">
            I have peace of mind knowing my digital assets are safe and will
            reach my loved ones without any hassle. It&apos;s the best decision I&apos;ve
            made for my family&apos;s future.
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-900 to-green-950 p-2 rounded-lg">
          <div>Cipherwill is popular for</div>
          <div className="font-bold text-xl">Security & User-Friendliness</div>
        </div>
      </div>
    </div>
  );
}
