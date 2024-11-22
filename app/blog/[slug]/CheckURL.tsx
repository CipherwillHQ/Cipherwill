"use client";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckURL({ slug, id }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!slug || !id) return;
    if (!pathname.includes(`-${id}`)) {
      router.replace(`/blog/${slug}-${id}`);
    }
  }, [pathname, router, slug, id]);

  return <div></div>;
}
