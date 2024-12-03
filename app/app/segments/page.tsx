"use client";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import segments from "./segments";
import { useUserContext } from "@/contexts/UserSetupContext";
import SimpleButton from "@/components/common/SimpleButton";
import Popup from "reactjs-popup";
import { IoArrowUpCircleOutline } from "react-icons/io5";
import { useMutation, useQuery } from "@apollo/client";
import GET_PREFERENCES from "@/graphql/ops/auth/queries/GET_PREFERENCES";
import UPDATE_PREFERENCES from "@/graphql/ops/auth/mutations/UPDATE_PREFERENCES";
import Link from "next/link";
import PremiumPopup from "./PremiumPopup";
import { Divider, Segment } from "@/types/Segments";
import SEND_FEEDBACK from "@/graphql/ops/generic/mutations/SEND_FEEDBACK";
import toast from "react-hot-toast";

export default function Segments() {
  const { user } = useUserContext();
  const current_user_plan = user?.plan || "free";
  const { data, loading, error } = useQuery(GET_PREFERENCES);
  const [sendFeedback] = useMutation(SEND_FEEDBACK);
  const [updatePreferences, { loading: updating }] =
    useMutation(UPDATE_PREFERENCES);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  const preferences = data?.getPreferences || {};

  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Segments">
        <Popup
          trigger={
            <button className="border border-default rounded-full py-1 px-4 text-xs font-semibold">
              Suggest a feature
            </button>
          }
          modal
        >
          {/* @ts-ignore */}
          {(close) => {
            return (
              <div className="flex flex-col gap-2 bg-white dark:bg-neutral-800 text-black dark:text-white border border-default rounded-md p-2 max-w-sm">
                <h2 className="text-xl font-semibold">
                  Tell us what we can do better
                </h2>
                <p className="text-sm opacity-80">
                  We&apos;re always looking for ways to improve CipherWill. If you
                  have a suggestion, please let us know.
                </p>
                <input
                  id="suggestion-input"
                  type="text"
                  placeholder="Message"
                  className="w-full bg-secondary p-2 rounded-md"
                />
                <SimpleButton
                  className="w-full"
                  onClick={() => {
                    const message = (
                      document.getElementById("suggestion-input") as any
                    )?.value;
                    if (!message) {
                      toast.error("Please enter a message");
                      return;
                    }
                    sendFeedback({
                      variables: {
                        message,
                      },
                    });
                    close();
                  }}
                >
                  Send to us
                </SimpleButton>
              </div>
            );
          }}
        </Popup>
      </DesktopAndMobilePageHeader>
      <div className="flex flex-wrap py-4 px-4 sm:py-0 gap-2">
        {segments.map((segment) => {
          if ((segment as Divider).divider) {
            return (
              <div
                key={(segment as Divider).divider}
                className="flex basis-[100%] font-semibold py-2 px-1"
              >
                {(segment as Divider).divider}
              </div>
            );
          }
          const user_preference =
            (segment as Segment).preference_key === null
              ? null
              : preferences[(segment as Segment).preference_key];

          const is_available_to_user =
            current_user_plan === (segment as Segment).plan_required ||
            (segment as Segment).plan_required === "free";
          return (
            <div
              key={(segment as Segment).title}
              className="border border-default rounded-md p-2 flex gap-2 flex-col bg-secondary w-full sm:w-80 h-fit"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {(segment as Segment).icon}
                  <div className="ml-2">{(segment as Segment).title}</div>
                </div>
                {is_available_to_user ? (
                  user_preference === null || user_preference === true ? (
                    <Link
                      className="hover:underline text-sm"
                      href={(segment as Segment).path}
                    >
                      Access
                    </Link>
                  ) : null
                ) : (
                  // available in user's plan
                  <div>
                    <Popup
                      trigger={
                        <div className="flex items-center gap-1 cursor-pointer w-[22px] overflow-hidden hover:w-20 transition-all duration-500 ease-out text-yellow-500 hover:text-yellow-600">
                          <div className="w-[22px] h-[22px]">
                            <IoArrowUpCircleOutline size={22} />
                          </div>
                          <span className="text-xs font-semibold">Upgrade</span>
                        </div>
                      }
                      modal
                    >
                      <PremiumPopup
                        path={(segment as Segment).path}
                        plan_required={(segment as Segment).plan_required}
                      />
                    </Popup>
                  </div>
                )}
              </div>

              <div className="text-sm">{(segment as Segment).description}</div>
              {is_available_to_user ? (
                <div className="flex items-center gap-2">
                  <div className="w-full">
                    {user_preference === null ? (
                      <div className="p-2 text-xs font-bold text-neutral-500 text-center rounded-md bg-primary w-full">
                        Enabled by default
                      </div>
                    ) : (
                      <div>
                        {user_preference ? (
                          <SimpleButton
                            className="w-full text-center"
                            onClick={() => {
                              if (updating) return;
                              updatePreferences({
                                variables: {
                                  key: (segment as Segment).preference_key,
                                  value: "false",
                                },
                              });
                            }}
                          >
                            Disable
                          </SimpleButton>
                        ) : (
                          <SimpleButton
                            className="w-full text-center"
                            onClick={() => {
                              if (updating) return;
                              updatePreferences({
                                variables: {
                                  key: (segment as Segment).preference_key,
                                  value: "true",
                                },
                              });
                            }}
                          >
                            Enable
                          </SimpleButton>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <Popup
                  trigger={
                    <button className="border border-default rounded-md p-2 text-sm bg-primary">
                      Segment is not available in your plan
                    </button>
                  }
                  modal
                >
                  <PremiumPopup
                    path={(segment as Segment).path}
                    plan_required={(segment as Segment).plan_required}
                  />
                </Popup>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
