"use client";
import { Crisp } from "crisp-sdk-web";
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import ME from "@/graphql/ops/auth/queries/ME";
import { IoChatbubblesOutline } from "react-icons/io5";
import { CRISP_TOKEN } from "@/common/constant";
import SidebarItem from "./Sidebar/SidebarItem";
import { twMerge } from "tailwind-merge";
import { MeData } from "@/types/interfaces";

// Only configure Crisp on client side
if (typeof window !== "undefined" && CRISP_TOKEN) {
  Crisp.configure(CRISP_TOKEN, {
    lockFullview: true,
    autoload: false,
    sessionMerge: true,
  });
}

function user_session_attach(data: MeData) {
  if (data?.me && typeof window !== "undefined") {
    if (Crisp.isCrispInjected()) {
      Crisp.setTokenId(data.me.id);
      Crisp.user.setEmail(data.me.email);
    }
  }
}

export default function LiveChatBox({ className }: { className?: string }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isCrispLoaded, setIsCrispLoaded] = useState(false);

  const { data, loading, error } = useQuery<MeData>(ME);

  // Load Crisp on mount
  useEffect(() => {
    if (typeof window === "undefined" || !CRISP_TOKEN) return;

    if (Crisp.isCrispInjected()) {
      setIsCrispLoaded(true);
    } else {
      Crisp.load();
      Crisp.session.onLoaded(() => {
        setIsCrispLoaded(true);
        Crisp.chat.hide();
        // get initial count after 2 seconds to ensure Crisp is fully loaded
        setTimeout(() => {
          try {
            setUnreadCount(Crisp.chat.unreadCount() || 0);
          } catch (error) {
            console.warn("Failed to get unread count:", error);
          }
        }, 2000);
      });
      Crisp.chat.onChatOpened(() => {
        setUnreadCount(0);
      });
      Crisp.message.onMessageReceived(() => {
        try {
          setUnreadCount(Crisp.chat.unreadCount() || 0);
        } catch (error) {
          console.warn("Failed to update unread count:", error);
        }
      });
      Crisp.chat.onChatClosed(() => {
        Crisp.chat.hide();
      });
    }
  }, []);

  // Attach user when data is available
  useEffect(() => {
    if (data && !loading && !error && isCrispLoaded) {
      user_session_attach(data);
    }
  }, [data, loading, error, isCrispLoaded]);

  useEffect(() => {
    // Only run on client side and if Crisp is available
    if (typeof window !== "undefined" && window.$crisp?.get && isCrispLoaded) {
      try {
        setUnreadCount(Crisp.chat.unreadCount() || 0);
      } catch (error) {
        console.warn("Failed to get initial unread count:", error);
      }
    }
  }, [isCrispLoaded]);

  const handleChatClick = () => {
    if (typeof window === "undefined" || !isCrispLoaded) return;
    
    try {
      // If chat is hidden, show it first, then open
      if (!Crisp.chat.isVisible()) {
        Crisp.chat.show();
      }
      Crisp.chat.open();
    } catch (error) {
      console.warn("Failed to open chat:", error);
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
          <div className="relative bg-black dark:bg-white text-white dark:text-black mr-2 h-5 w-5 text-sm text-center rounded-full flex items-center justify-center">
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
