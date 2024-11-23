"use client";
import getTimeRemaining from "@/common/time/getTimeRemaining";
import SimpleButton from "@/components/common/SimpleButton";
import { DateTime } from "luxon";
import { usePostHog } from "posthog-js/react";
import { ReactNode, useEffect, useState } from "react";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";

interface Props {
  children?: ReactNode;
}

export function MaintananceModeProvider({ children }: Props) {
  const posthog = usePostHog();
  const [under_maintanance, set_under_maintanance] = useState<
    | false
    | {
        message: string;
        ttl: string;
      }
  >(false);
  useEffect(() => {
    posthog.onFeatureFlags((flags) => {
      if (posthog.isFeatureEnabled("maintanance-mode")) {
        const payload: any = posthog.getFeatureFlagPayload("maintanance-mode");
        set_under_maintanance({
          message: payload.message,
          ttl: payload.ttl,
        });
      }
    });
  }, []);

  if (under_maintanance) {
    return (
      <div className="bg-white text-black dark:bg-black dark:text-white p-4 h-screen w-screen flex flex-col gap-4 items-center justify-center text-center">
        <HiOutlineWrenchScrewdriver size={50} />

        <h1 className="text-3xl font-bold">Under maintanance</h1>
        <div>{under_maintanance.message}</div>
        <RemainingTimer ttl={parseInt(under_maintanance.ttl)} />
        <SimpleButton
          className="w-full max-w-xs"
          onClick={() => {
            window.location.reload();
          }}
        >
          Refresh
        </SimpleButton>
      </div>
    );
  }

  return children;
}

function RemainingTimer({ ttl }: { ttl: number }) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(ttl, true));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(ttl, true));
    }, 1000);

    return () => clearInterval(interval);
  }, [ttl]);

  return (
    <div suppressHydrationWarning>
      Should be back{" "}
      {timeLeft.includes("any time now") ? "at any time now" : `in ${timeLeft}`}
    </div>
  );
}
