/**
 * @file AnonymousChatBox.tsx
 * @description A button component for launching the Tawk.to chat widget as an anonymous visitor.
 * @owns Trigger UI, loading of Tawk.to, and maximizing the widget.
 * @doesNotManage Authenticated user sessions or unread notification badges.
 */

"use client";
import { TAWK_PROPERTY_ID, TAWK_WIDGET_ID } from "@/common/constant";
import { loadTawkScript } from "@/common/tawk";
import { useEffect, useState } from "react";
import { IoChatbubblesOutline } from "react-icons/io5";
import { twMerge } from "tailwind-merge";

export default function AnonymousChatBox({ className }: { className?: string }) {
  const [isTawkLoaded, setIsTawkLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !TAWK_PROPERTY_ID || !TAWK_WIDGET_ID) return;

    // Standard Tawk.to initialization structure
    const tawkApi = ((window as any).Tawk_API = (window as any).Tawk_API || {});
    (window as any).Tawk_LoadStart = new Date();

    // Check if Tawk.to is already loaded from a previous mount
    if (typeof tawkApi.maximize === "function") {
      setTimeout(() => {
        setIsTawkLoaded(true);
      }, 0);
      try {
        if (typeof tawkApi.hideWidget === "function") {
          tawkApi.hideWidget();
        }
      } catch (e) {}
    } else {
      // Set onload callback
      tawkApi.onLoad = () => {
        setIsTawkLoaded(true);
        try {
          if (typeof tawkApi.hideWidget === "function") {
            tawkApi.hideWidget();
          }
        } catch (e) {
          console.warn("Failed to hide widget on load:", e);
        }
      };
    }

    tawkApi.onChatMinimized = () => {
      try {
        if (typeof tawkApi.hideWidget === "function") {
          tawkApi.hideWidget();
        }
      } catch (e) {
        console.warn("Failed to hide widget on minimize:", e);
      }
    };

    loadTawkScript(TAWK_PROPERTY_ID, TAWK_WIDGET_ID);
  }, []);

  const handleChatClick = () => {
    if (typeof window === "undefined") return;
    const tawkApi = (window as any).Tawk_API;
    if (!tawkApi) return;

    try {
      if (typeof tawkApi.showWidget === "function") {
        tawkApi.showWidget();
      }
      if (typeof tawkApi.maximize === "function") {
        tawkApi.maximize();
      } else if (typeof tawkApi.toggle === "function") {
        tawkApi.toggle();
      } else {
        console.warn("Tawk.to API is not fully loaded yet.");
      }
    } catch (error) {
      console.warn("Failed to open chat:", error);
    }
  };

  return (
    <div
      className={twMerge(
        "flex items-center py-2 px-6 cursor-pointer border rounded-md bg-black text-white max-w-fit",
        className
      )}
      onClick={handleChatClick}
    >
      <IoChatbubblesOutline className="mr-2 text-xl font-semibold" />
      <span className="text-sm font-medium">Live Chat with Team</span>
    </div>
  );
}
