"use client";
import Popup from "reactjs-popup";

export default function DeadManSwitchExplainer() {
  return (
    <>
      <div className="bg-gradient-to-b from-neutral-800 to-black text-white font-black py-10 overflow-hidden">
        <div className="text-2xl sm:text-5xl md:text-6xl xl:text-7xl w-full max-w-7xl mx-auto p-2">
          <div className="text-end w-full whitespace-nowrap">
            END-TO-END ENCRYPTED
          </div>
          <div className="text-start w-full whitespace-nowrap">
            DEAD MAN&apos;S SWITCH
            <Popup
              trigger={
                <button className="border font-medium border-neutral-400 hover:bg-neutral-800 rounded-full text-sm px-4 py-1 mx-2">
                  What is that?
                </button>
              }
              modal
            >
              <div className="bg-white p-4 rounded shadow-lg max-w-lg">
                <h2 className="font-semibold text-xl mb-4">
                  Dead man&apos;s switch from wikipedia
                </h2>
                <p className="font-medium">
                  A dead man&apos;s switch is a switch designed to be activated
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
