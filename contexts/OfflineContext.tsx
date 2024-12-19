"use client";
import { ReactNode, useEffect, useState } from "react";
import { RiWifiOffLine } from "react-icons/ri";

interface Props {
  children?: ReactNode;
}
let debounceTimer;

export function OfflineContext({ children }: Props) {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    function onlineHandler() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        setOnline(true);
      }, 2000); // wait 2 seconds before setting online
    }

    function offlineHandler() {
      setOnline(false);
    }

    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", offlineHandler);

    return () => {
      window.removeEventListener("online", onlineHandler);
      window.removeEventListener("offline", offlineHandler);
    };
  }, []);

  return (
    <>
      {online ? (
        children
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-screen p-3 text-center">
          <RiWifiOffLine size={30} />
          <h1 className="text-xl font-semibold p-4">You're Offline</h1>
          <p>Please check your internet connection</p>
        </div>
      )}
    </>
  );
}