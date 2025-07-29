"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function ScrollToSec() {
  const searchParams = useSearchParams();
  const topic = searchParams?.get("topic");
  const router = useRouter();
  useEffect(() => {
    if (topic) {
      const heading = document.getElementById(`q:${topic}`);
      if (heading) {
        window.scrollTo({
          top: heading.offsetTop - 200,
          behavior: "smooth",
        });
      }
    }
  }, [topic]);
  return null;
}
