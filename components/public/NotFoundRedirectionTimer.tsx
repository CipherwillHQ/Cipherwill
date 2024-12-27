"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotFoundRedirectionTimer() {
  const [second, setSecond] = useState(5);
  useEffect(() => {
    const timer = setInterval(() => {
      setSecond((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  if(second === 0) {
    return redirect("/");
  }

  return <div>Redirecting to Home Page in {second} seconds...</div>;
}
