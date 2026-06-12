/**
 * @file LiveChatBox.tsx
 * @description A sidebar widget/button that integrates Tawk.to chat with user details and tracks unread message notifications.
 * @owns Sidebar UI button, unread count badge, authenticated user attributes synchronization.
 * @doesNotManage Core layout structure or routing.
 */

"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import ME from "@/graphql/ops/auth/queries/ME";
import { IoChatbubblesOutline } from "react-icons/io5";
import { TAWK_PROPERTY_ID, TAWK_WIDGET_ID } from "@/common/constant";
import { loadTawkScript } from "@/common/tawk";
import SidebarItem from "./Sidebar/SidebarItem";
import { twMerge } from "tailwind-merge";
import { MeData } from "@/types/interfaces";

function user_session_attach(data: MeData) {
  if (data?.me && typeof window !== "undefined") {
    const tawkApi = (window as any).Tawk_API;
    if (tawkApi && typeof tawkApi.setAttributes === "function") {
      const name = [data.me.first_name, data.me.middle_name, data.me.last_name]
        .filter(Boolean)
        .join(" ") || data.me.email;

      tawkApi.setAttributes({
        name,
        email: data.me.email,
        id: data.me.id,
        plan: data.me.plan,
      }, (error: any) => {
        if (error) {
          console.warn("Failed to set Tawk.to attributes:", error);
        }
      });
    }
  }
}

export default function LiveChatBox({ className }: { className?: string }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTawkLoaded, setIsTawkLoaded] = useState(false);

  const { data, loading, error } = useQuery<MeData>(ME);

  // Load Tawk on mount
  useEffect(() => {
    if (typeof window === "undefined" || !TAWK_PROPERTY_ID || !TAWK_WIDGET_ID) return;

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

    tawkApi.onUnreadCountChanged = (count: number) => {
      setUnreadCount(count || 0);
    };

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

  // Attach user when data is available
  useEffect(() => {
    if (data && !loading && !error && isTawkLoaded) {
      user_session_attach(data);
    }
  }, [data, loading, error, isTawkLoaded]);

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
    } catch (err) {
      console.warn("Failed to open chat:", err);
    }
  };

  return (
    <div
      className={twMerge("flex items-center cursor-pointer", className)}
      onClick={handleChatClick}
    >
      {unreadCount === 0 ? (
        <SidebarItem
          icon={<IoChatbubblesOutline />}
          title="Live Chat with Team"
        />
      ) : (
        <div className="flex items-center">
          <div className="relative bg-black dark:bg-white text-white dark:text-black mx-2 h-5 w-5 text-sm text-center rounded-full flex items-center justify-center">
            <div className="absolute -top-1 -right-1 bg-yellow-500 h-2 w-2 rounded-full animate-ping" />
            <span className="text-xs font-bold">{unreadCount > 99 ? "99+" : unreadCount}</span>
          </div>
          <span className="text-lg sm:text-sm font-medium">
            Live Chat with Team
          </span>
        </div>
      )}
    </div>
  );
}
