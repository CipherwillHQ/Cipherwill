import heroSit from "@/assets/images/hero.webp";
import Image from "next/image";

const items = [
  {
    "title": "Complete Your Profile",
    "description": "Start by filling out your profile with key details about your digital assets and how you'd like them managed. This forms the foundation of your digital will."
  },
  {
    "title": "Add Your Data and Assets",
    "description": "Securely store everything from crypto wallets, bank details, and investments to emails, logins, and personal notes. Cipherwill keeps it all encrypted and safe."
  },
  {
    "title": "Multi-Layer Encryption Security",
    "description": "Your data is protected with advanced encryption. Only authorized beneficiaries with the correct keys can unlock the information."
  },
  {
    "title": "Automatic Data Transfer",
    "description": "If you’re unable to update your will, Cipherwill’s schedule ensures your encrypted data is transferred seamlessly to your beneficiaries."
  },
  {
    "title": "And just like that!",
    "description": "Your legacy is secured, your wishes are honored, and your loved ones are cared for, all with Cipherwill.\n\n\n\n\n"
  }
];


export default function ScrollExplainer() {

  return (
    <section className="grid lg:grid-cols-2 px-4 lg:pb-30">
      <div className="relative grid items-start justify-items-center gap-y-4 max-lg:hidden lg:gap-y-12">
        <div className="sticky top-[8vh] py-[11vw] lg:w-[30vw]">
          <div className="relative aspect-square w-full">
            {/* <img
              alt=""
              loading="lazy"
              width="260"
              height="260"
              decoding="async"
              data-nimg="1"
            /> */}
            <Image
            src={heroSit}
            alt="hero"
            width={800}
            height={800}
            className="absolute z-40 size-full rounded-full transition-all duration-500"
            />
          </div>
        </div>
      </div>
      <div className="relative max-lg:row-start-1 px-0 lg:px-10">
        <div className="sticky inset-x-0 top-14 bg-gradient-to-b from-white from-30% to-transparent max-lg:hidden lg:h-[16vw]"></div>
        <ol className="flex flex-col max-lg:divide-y">
          {items.map((item, index) => (
            <li
              key={item.title}
              className={`w-full py-16 font-display tracking-tight md:py-24 lg:max-w-sm lg:first:pt-0 lg:last:pb-0 xl:py-40`}
            >
              <h3 className="text-lg sm:text-2xl font-bold">
                {index + 1}. {item.title}
              </h3>
              <div className="text-lg pt-4 whitespace-pre-wrap">
                {item.description}
              </div>
            </li>
          ))}
        </ol>
        <div className="sticky inset-x-0 bottom-0 bg-gradient-to-t from-white from-30% to-transparent max-lg:hidden lg:h-[17vw]"></div>
      </div>
    </section>
  );
}
