'use client';
import four_o_four from "@/assets/images/four_o_four.png";
import Image from "next/image";
import { useEffect } from "react";

export default function NotFound() {
    useEffect(() => {
      setTimeout(() => {
        window.location.href = "/";
      }, 5000);
    }, [])
    
  return (
    <div className="flex flex-col items-center font-semibold justify-center gap-2 text-center min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <Image
        src={four_o_four}
        alt="404 - Page Not Found"
        width={404}
        height={404}
      />
      <h1 className="font-black text-lg">404 - Page Not Found</h1>
      <div>Redirecting to Home Page in 5 seconds...</div>
    </div>
  );
}
