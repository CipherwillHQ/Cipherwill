"use client";
import dynamic from "next/dynamic";
const CSSImporter = dynamic(() => import("@/components/CSSImporter"), {
  ssr: false,
});
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ReactNode, Suspense } from "react";
import { RecoilRoot } from "recoil";

interface Props {
  children?: ReactNode;
}

export function RecoilContext({ children }: Props) {
  return (
    <RecoilRoot>
      <Suspense>
        <CSSImporter />
      </Suspense>
      <SpeedInsights />
      {children}
    </RecoilRoot>
  );
}
