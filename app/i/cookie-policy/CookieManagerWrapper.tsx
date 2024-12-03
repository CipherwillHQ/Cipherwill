"use client";

import dynamic from "next/dynamic";

const CookieManager = dynamic(() => import("./CookieManager"), {
  ssr: false,
});
export default function CookieManagerWrapper() {
  return <CookieManager />;
}
