"use client";
import { Crisp } from "crisp-sdk-web";
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import ME from "@/graphql/ops/auth/queries/ME";
import { IoChatbubblesOutline } from "react-icons/io5";
import { CRISP_TOKEN } from "@/common/constant";
import SidebarItem from "./Sidebar/SidebarItem";
import { twMerge } from "tailwind-merge";

Crisp.configure(CRISP_TOKEN ?? "", {
  lockFullview: true,
  autoload: false,
  sessionMerge: true,
});

function user_session_attach(data) {
  if (data?.me) {
    if (Crisp.isCrispInjected()) {
      Crisp.setTokenId(data.me.id);
      Crisp.user.setEmail(data.me.email);
    }
  }
}

export default function LiveChatBox({ className }: { className?: string }) {
  const [unreadCount, setUnreadCount] = useState(
    window.$crisp?.get ? Crisp.chat.unreadCount() : 0
  );

  useQuery(ME, {
    onCompleted: (data) => {
      user_session_attach(data);
      Crisp.load();
      Crisp.session.onLoaded((e) => {
        Crisp.chat.hide();
        // get initial count after 5 seconds
        setTimeout(() => {
          setUnreadCount(Crisp.chat.unreadCount());
        }, 5000);
      });
      Crisp.chat.onChatOpened(() => {
        setUnreadCount(0);
      });
      Crisp.message.onMessageReceived(() => {
        setUnreadCount(Crisp.chat.unreadCount());
      });
      Crisp.chat.onChatClosed(() => {
        Crisp.chat.hide();
      });
    },
  });
  useEffect(() => {
    if (window.$crisp?.get) {
      setUnreadCount(Crisp.chat.unreadCount());
    }
  }, []);

  return (
    <div
      className={twMerge("flex items-center cursor-pointer", className)}
      onClick={() => {
        if (Crisp.chat.isVisible()) {
          Crisp.chat.show();
        }
        Crisp.chat.open();
      }}
    >
      {unreadCount === 0 ? (
        <SidebarItem
          icon={<IoChatbubblesOutline />}
          title="Live Chat with Team"
        />
      ) : (
        <div className="flex items-center">
          <div className="bg-black dark:bg-white text-white dark:text-black  mr-2 h-5 w-5 text-sm text-center rounded-full">
            <div className="bg-yellow-500 h-2 w-2 rounded-full overflow-hidden animate-ping float-right -mr-2" />
            <span className="text-sm font-bold">{unreadCount || "0"}</span>
          </div>
          <span className="text-lg sm:text-sm font-medium">
            Live Chat with Team
          </span>
        </div>
      )}
    </div>
  );
}
