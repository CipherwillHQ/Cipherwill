/**
 * MobileHeader component representing the mobile hamburger menu drawer for Cipherwill.
 * Owns the mobile navigation, expanded slide-out navigation layout, and mobile CTA button.
 * Does NOT handle the main desktop header links or layout.
 */

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
        className="cursor-pointer px-2 text-forest dark:text-cream"
        onClick={() => {
          setIsOpen((s) => !s);
        }}
      >
        <TfiMenu size={25} />
      </div>
      <div
        className={`absolute top-0 left-0 w-full bg-cream dark:bg-[#101113] text-forest dark:text-cream flex flex-col justify-between
          transition-all duration-300 overflow-hidden z-50
        ${isOpen ? "h-screen py-3" : "h-0"}
        `}
      >
        <div>
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

            <div className="p-2 cursor-pointer text-forest dark:text-cream" onClick={() => setIsOpen(false)}>
              <TfiClose size={25} />
            </div>
          </div>
          <div className="flex flex-col items-center px-4 overflow-auto customScrollbar">
            <div
              className="cursor-pointer font-semibold text-lg text-left w-full h-11 flex items-center border-b border-forest/5"
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
                <div className="w-full border-b border-forest/5" key={item.path}>
                  <div className="flex items-center justify-between h-11">
                    <div
                      className="cursor-pointer font-semibold text-lg flex-1 h-full flex items-center"
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
                        className="text-xs text-forest/50 font-normal p-2 cursor-pointer h-full flex items-center"
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
                      className={`overflow-hidden transition-all duration-300 ease-cw-ease ${
                        hoverMenu === item.path ? "max-h-96 py-2" : "max-h-0"
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
        </div>
        <div className="p-4 mt-auto">
          <SimpleButton
            href="/app"
            className="py-3 rounded-xl w-full font-semibold text-sm active:scale-[0.98] transition-all duration-200"
          >
            {user ? "Go to dashboard" : "Login/Signup"}
          </SimpleButton>
        </div>
      </div>
    </div>
  );
}
