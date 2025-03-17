"use client";
import { RiOpenSourceFill } from "react-icons/ri";
import { ImSwitch } from "react-icons/im";
import Popup from "reactjs-popup";
import { GiPadlock } from "react-icons/gi";

export default function DeadManSwitchExplainer() {
  return (
    <>
      <div className="bg-linear-to-b from-neutral-800 to-black text-white font-black py-10 overflow-hidden">
        <div className="flex flex-col gap-2 text-2xl sm:text-5xl md:text-6xl xl:text-7xl w-full max-w-7xl mx-auto p-2">
          <div className="flex items-center gap-2">
            <RiOpenSourceFill className="scale-75" />
            OPEN SOURCE
          </div>
          <div className="flex items-center gap-2">
            <GiPadlock className="scale-75" />
            END-TO-END ENCRYPTED
          </div>
          <div className="flex flex-col md:flex-row gap-2 justify-between md:items-end">
            <div className="flex items-center gap-2">
              <ImSwitch className="scale-75" />
              DEAD MAN'S SWITCH
            </div>
            <Popup
              trigger={
                <button
                  className="border font-medium border-neutral-400 hover:bg-neutral-800 rounded-full text-sm px-4 py-1 mx-2 h-min"
                  suppressHydrationWarning
                >
                  What is that?
                </button>
              }
              modal
            >
              <div className="bg-white p-4 rounded-sm shadow-lg max-w-lg">
                <h2 className="font-semibold text-xl mb-4">
                  Dead man's switch from wikipedia
                </h2>
                <p className="font-medium">
                  A dead man's switch is a switch designed to be activated
                  or deactivated if the human operator becomes incapacitated,
                  such as through death, loss of consciousness, or being bodily
                  removed from control.
                </p>
                <div className="font-semibold pt-3">
                  We deliver encrypted data to your loved ones, if something
                  happens to you.
                </div>
              </div>
            </Popup>
          </div>
        </div>
      </div>
    </>
  );
}
