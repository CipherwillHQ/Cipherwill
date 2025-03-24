import darkSS from "@/assets/images/dark-ss.png";
import darkSSMobile from "@/assets/images/dark-ss-mobile.jpg";
import Image from "next/image";

export default function ScreenshotDemo() {
  return (
    <div className="w-full pt-2 px-4 mx-auto max-w-7xl -mt-20 flex items-center justify-center">
      {/* <div className="bg-lime-200 dark:bg-yellow-200 w-full h-[650px] rounded-xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"></div> */}
      <Image
        src={darkSS.src}
        alt="Screenshot of Cipherwill"
        width={1400}
        height={1400}
        className="hidden sm:block rounded-t-md sm:rounded-t-xl outline-4 outline-lime-500 outline-offset-4"
      />
      <Image
        src={darkSSMobile.src}
        alt="Screenshot of Cipherwill"
        width={600}
        height={20000}
        className="sm:hidden rounded-t-md sm:rounded-t-xl outline-4 outline-lime-500 outline-offset-4"
      />
    </div>
  );
}
