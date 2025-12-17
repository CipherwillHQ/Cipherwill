import SimpleButton from "@/components/common/SimpleButton";
import { JSX } from "react";
import { FiX } from "react-icons/fi";
import Popup from "reactjs-popup";

export default function RestrictedPopup({
  plan = "premium",
  trigger,
}: {
  plan?: string;
  trigger: JSX.Element;
}) {
  return (
    <Popup trigger={<div>{trigger}</div>} modal closeOnDocumentClick>
      {
        ((close: () => void) => (
          <div className="bg-white dark:bg-neutral-900 text-black dark:text-white rounded-md border border-default max-w-md w-full shadow-xl">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-default">
              <div className="shrink-0 rounded-md p-2 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white">
                {/* Lock icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 8V6a3 3 0 116 0v3H9z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold">Premium Feature</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-default">
                    Requires {plan}
                  </span>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Unlock premium features with the {plan} plan
                </p>
              </div>
              <button
                aria-label="Close"
                className="ml-2 rounded-md p-2 hover:cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
                onClick={close}
              >
                <FiX className="text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
              <div className="text-sm">
                This section is restricted on your current plan. Upgrade to
                access premium segments, and priority support tailored for power
                users.
              </div>

              <ul className="grid grid-cols-1 gap-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  </span>
                  Unlimited beneficiaries and Data
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  </span>
                  Flexible Cipherwill Execution Timeline
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  </span>
                  Per-Item Beneficiary Selection
                </li>
              </ul>

              <div className="flex items-center w-full justify-evenly gap-2 pt-1">
                <SimpleButton href="/pricing" variant="secondary">
                  Compare plans
                </SimpleButton>
                <SimpleButton variant="primary" href="/app/billing">
                  Upgrade to {plan}
                </SimpleButton>
              </div>

              <div className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
                Already upgraded? Try refreshing the page.
              </div>
            </div>
          </div>
        )) as any
      }
    </Popup>
  );
}
