import Image from "next/image";
import logoBlack from "../../assets/logo-black.png";
import logoWhite from "../../assets/logo-white.png";
export default function FullscreenLoader() {
  return (
    <div className="flex flex-row items-center justify-center h-screen bg-white dark:bg-neutral-900">
      <div className="animate-ping">
        <Image
          alt="cipherwill logo"
          src={logoWhite}
          width={25}
          height={25}
          className="my-4 sm:my-0 hidden dark:block"
        />
        <Image
          alt="cipherwill logo"
          src={logoBlack}
          width={25}
          height={25}
          className="my-4 sm:my-0 dark:hidden"
        />
      </div>
    </div>
  );
}
