"use client";

import SimpleButton from "@/components/common/SimpleButton";
import { useEffect, useState } from "react";
import { c } from "react-notion-x/build/context-CjLVO7h1";

export default function CookieManager() {
  const [isAdOptAvailable, setisAdOptAvailable] = useState(false);

  useEffect(() => {
    if (isAdOptAvailable) {
      return;
    }
    // if isAdOptAvailable is false, set interval to check again every 3s

    const interval = setInterval(() => {
      setisAdOptAvailable(
        document.querySelector("div#adopt-controller-button") ? true : false
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [isAdOptAvailable]);

  if (!isAdOptAvailable) {
    return null;
  }
  return (
    <div className="w-full text-center">
      <SimpleButton
        onClick={() => {
          const control_btn: HTMLDivElement = document.querySelector(
            "div#adopt-controller-button"
          );
          if (control_btn) {
            control_btn.style.setProperty("display", "block", "important");
          }
          const cookie_popup: HTMLDivElement =
            document.querySelector("div#cookie-banner");
          if (cookie_popup) {
            cookie_popup.style.setProperty("display", "block", "important");
          }
        }}
      >
        Manage Cookie Preferences
      </SimpleButton>
    </div>
  );
}
