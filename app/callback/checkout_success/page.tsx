"use client";
import { RedirectType, redirect } from "next/navigation";
import { useEffect } from "react";

export default function CheckoutSuccess() {
  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      window.location.href = "/app/billing";
    }, 5000);
    return () => {
      clearTimeout(redirectTimeout);
    };
  }, []);

  return (
    <div className="p-2 flex flex-col items-center justify-center h-screen text-center">
      Redirecting you to home page
      <br />
      Please wait...
    </div>
  );
}
