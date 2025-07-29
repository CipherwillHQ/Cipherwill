"use client";

import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TfiClose, TfiMenu } from "react-icons/tfi";
import black_logo from "../../assets/logo-black.png";
import white_logo from "../../assets/logo-white.png";
import menu from "./menu";
import SimpleButton from "../common/SimpleButton";
import { MdExpandMore } from "react-icons/md";

export default function MobileHeader() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [hoverMenu, setHoverMenu] = useState<any | null>(null);

  return (
    <div className="sm:hidden">
      <div
        className="cursor-pointer px-2"
        onClick={() => {
          setIsOpen((s) => !s);
        }}
      >
        <TfiMenu size={25} />
      </div>
      <div
        className={`absolute top-0 left-0 w-full bg-white dark:bg-neutral-900 text-black dark:text-white flex flex-col
          transition-all duration-300 overflow-hidden
        ${isOpen ? "h-screen py-3" : "h-0"}
        `}
      >
        <div className="flex items-center justify-between px-4 py-2">
          <Image
            alt="cipherwill white logo"
            src={white_logo}
            width={30}
            height={30}
            className="hidden dark:block"
          />
          <Image
            alt="cipherwill black logo"
            src={black_logo}
            width={30}
            height={30}
            className="block dark:hidden"
          />

          <div className="p-2 cursor-pointer" onClick={() => setIsOpen(false)}>
            <TfiClose size={25} />
          </div>
        </div>
        <div className="flex flex-col items-center px-4 overflow-auto customScrollbar">
          <div
            className="cursor-pointer font-semibold text-lg text-left w-full py-2"
            onClick={() => {
              setIsOpen(false);
              setTimeout(() => {
                router.push("/");
              }, 300);
            }}
          >
            Homepage
          </div>
          {menu.map((item) => {
            return (
              <div className="w-full py-2" key={item.path}>
                <div className="flex items-center justify-between">
                  <div
                    className="cursor-pointer font-semibold text-lg"
                    onClick={() => {
                      setIsOpen(false);
                      setTimeout(() => {
                        router.push(item.path);
                      }, 300);
                    }}
                  >
                    {item.title}
                  </div>
                  {item.mobile_hover && (
                    <div
                      className="text-xs text-gray-500 font-normal"
                      onClick={() => {
                        if (hoverMenu === item.path) {
                          setHoverMenu(null);
                        } else {
                          setHoverMenu(item.path);
                        }
                      }}
                    >
                      {hoverMenu === item.path ? (
                        <MdExpandMore size={25} />
                      ) : (
                        <MdExpandMore size={25} className="-rotate-90" />
                      )}
                    </div>
                  )}
                </div>
                {item.mobile_hover && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      hoverMenu === item.path ? "h-full" : "h-0"
                    }`}
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    {item.mobile_hover}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="p-4">
          <SimpleButton href="/app" className="p-2 rounded-full w-full">
            {user ? "Go to dashboard" : "Login/Signup"}
          </SimpleButton>
        </div>
      </div>
    </div>
  );
}
