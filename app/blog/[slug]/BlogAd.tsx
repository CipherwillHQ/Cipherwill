import SimpleButton from "@/components/common/SimpleButton";
import Image from "next/image";
import Link from "next/link";

export default function BlogAd() {
  return (
    <div className="flex flex-col items-center gap-2 max-w-md mx-auto">
      <Image
        src={"/og-img.png"}
        width={500}
        height={500}
        alt="Cipherwill Promo Image"
        className="rounded-sm"
      />
      <div className="text-lg font-bold w-full">
        Hey, we've written this blog post. <br />
        Here's what we do. If you're interested.
      </div>
      <div className="font-medium">
        We ensure your data reaches your loved ones when you pass away.
        Cipherwill is an automated and end-to-end encrypted digital will
        platform.
      </div>
      <div className="flex items-center gap-2 w-full">
        <SimpleButton className="w-full p-2" link_className="w-full" href="/">
          Visit Cipherwill
        </SimpleButton>
      </div>
    </div>
  );
}
