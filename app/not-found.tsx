import four_o_four from "@/assets/images/four_o_four.png";
import NotFoundRedirectionTimer from "@/components/public/NotFoundRedirectionTimer";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center font-semibold justify-center gap-2 text-center min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <Image
        src={four_o_four}
        alt="404 - Page Not Found"
        width={404}
        height={404}
      />
      <h1 className="font-black text-lg">404 - Page Not Found</h1>
      <NotFoundRedirectionTimer/>      
    </div>
  );
}
