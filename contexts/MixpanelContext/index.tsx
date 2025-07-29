"use client";
import { createContext, ReactNode, useContext, useEffect } from "react";
import mixpanel, { Mixpanel } from "mixpanel-browser";

interface Props {
  children?: ReactNode;
}
const MixpanelContext = createContext<any>({});

const DEBUG_MIXPANEL = false;

export function MixpanelProvider({ children }: Props) {
  useEffect(() => {
    mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN ?? "", {
      api_host: process.env.NEXT_PUBLIC_MIXPANEL_HOST,
      track_pageview: "url-with-path",
      debug:
        process.env.NEXT_PUBLIC_BUILD_ENV !== "production"
          ? DEBUG_MIXPANEL
            ? true
            : false
          : false,
    });
  }, []);

  return (
    <MixpanelContext.Provider value={mixpanel}>
      {children}
    </MixpanelContext.Provider>
  );
}
export function useMixpanel(): Mixpanel {
  return useContext(MixpanelContext);
}
