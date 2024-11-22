"use client";
import { CRISP_TOKEN } from "@/common/constant";
import { Crisp } from "crisp-sdk-web";
import { useEffect } from "react";
import { IoChatbubblesOutline } from "react-icons/io5";

Crisp.configure(CRISP_TOKEN, {
  lockFullview: true,
  autoload: false,
  sessionMerge: true,
});

export default function AnonymousChatBox() {
  useEffect(() => {
    Crisp.load();
  }, []);
  return (
    <div
      className="flex items-center py-2 px-6 cursor-pointer border rounded-md bg-black text-white max-w-fit"
      onClick={() => {
        if (Crisp.chat.isVisible) {
          Crisp.chat.show();
        }
        Crisp.chat.open();
      }}
    >
      <IoChatbubblesOutline className="mr-2 text-xl font-semibold" />
      <span className="text-sm font-medium">Live Chat with Team</span>
    </div>
  );
}
