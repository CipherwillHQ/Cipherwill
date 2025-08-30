import Image from "next/image";
import intro_img from "./intro_bg.jpeg";

export default function CipherwillIntroBox() {
    return (
        <section className="px-6">
        <div className="relative py-24 my-20 px-4 text-white w-full max-w-7xl mx-auto rounded-4xl overflow-hidden">
          <Image
            src={intro_img}
            alt="Background Image"
            layout="fill"
            objectFit="cover"
            quality={50}
            placeholder="blur"
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/90 to-black/80"></div>
  
          <div className="text-center flex flex-col items-center relative">
          <h2 className="text-4xl md:text-7xl font-semibold py-4">
              Hey! Meet Cipherwill
            </h2>
            <p className="p-4 text-xl font-medium max-w-xl mx-auto">
              Cipherwill lets you store all your important information in one
              place and transfer it with trusted people when you die.
            </p>
          </div>
        </div>
      </section>
    )
}
