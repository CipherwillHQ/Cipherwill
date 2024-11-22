"use client";

import SimpleButton from "@/components/common/SimpleButton";
import { useEffect, useState } from "react";

export default function CookieManager() {
  const [isIllowAvailable, setisIllowAvailable] = useState(
    (window as any).illow ? true : false
  );

  useEffect(() => {
    if (isIllowAvailable) {
      return;
    }
    // if isIllowAvailable is false, set interval to check again every 3s

    const interval = setInterval(() => {
      setisIllowAvailable((window as any).illow ? true : false);
    }, 3000);
    return () => clearInterval(interval);
  }, [isIllowAvailable]);

  if (!isIllowAvailable) {
    return null;
  }
  return (
    <div className="w-full text-center">
      <SimpleButton
        onClick={() => {
          (window as any).illow.showWidget();
          const banner: any = document.querySelector(
            "iframe#illow-banner-widget"
          );
          if (banner) {
            banner.style.display = "block";
          }
        }}
      >
        Manage Cookie Preferences
      </SimpleButton>
    </div>
  );
}
