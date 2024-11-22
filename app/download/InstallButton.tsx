"use client";

import SimpleButton from "@/components/common/SimpleButton";
import { useEffect, useState } from "react";

export default function InstallButton() {
  const [differedEvent, setDifferedEvent] = useState(null);
  const saveDifferedEvent = (event) => {
    // Prevent the mini-infobar from appearing on mobile.
    event.preventDefault();
    console.log("👍", "beforeinstallprompt", event);
    // Stash the event so it can be triggered later.
    setDifferedEvent(event);
  };

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", saveDifferedEvent);
    return () => {
      window.removeEventListener("beforeinstallprompt", saveDifferedEvent);
    };
  }, []);

  if (differedEvent === null) {
    return null;
  }

  return (
    <div className="my-12">
      <SimpleButton
        onClick={(e) => {
          differedEvent.prompt();
        }}
      >
        Click to Install Cipherwill
      </SimpleButton>

      <div className="mt-6 font-semibold">OR </div>
      <div>add manually using following instructions</div>
    </div>
  );
}
