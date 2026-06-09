"use client";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import segments from "./segments";
import { useUserContext } from "@/contexts/UserSetupContext";
import Popup from "reactjs-popup";
import { useMutation, useQuery } from "@apollo/client/react";
import GET_PREFERENCES from "@/graphql/ops/auth/queries/GET_PREFERENCES";
import UPDATE_PREFERENCES from "@/graphql/ops/auth/mutations/UPDATE_PREFERENCES";
import Link from "next/link";
import PremiumPopup from "./PremiumPopup";
import { Divider, Segment } from "@/types/Segments";
import type {
  GetPreferencesQuery,
  UpdatePreferencesMutation,
  UpdatePreferencesVariables,
} from "@/types/interfaces/metamodel";
import SuggestionBox from "@/components/app/dashboard/SuggestionBox";

export default function Segments() {
  const { user } = useUserContext();
  const current_user_plan = user?.plan || "free";
  const { data, loading, error } = useQuery<GetPreferencesQuery>(GET_PREFERENCES);
  const [updatePreferences, { loading: updating }] =
    useMutation<UpdatePreferencesMutation, UpdatePreferencesVariables>(UPDATE_PREFERENCES);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  const preferences = data?.getPreferences || {};

  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Segments">
        <SuggestionBox triggerText="💡 Suggest a segment" />
      </DesktopAndMobilePageHeader>
      <div className="flex flex-col px-2 sm:px-4">
        {segments.map((item) => {
          if ((item as Divider).divider) {
            return (
              <div
                key={(item as Divider).divider}
                className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 pt-6 pb-1.5 px-2"
              >
                {(item as Divider).divider}
              </div>
            );
          }

          const seg = item as Segment;
          const user_preference =
            seg.preference_key === null
              ? null
              : preferences[seg.preference_key as string];

          const is_available_to_user =
            current_user_plan === seg.plan_required ||
            seg.plan_required === "free";

          const is_enabled =
            user_preference === null || user_preference === true;

          return (
            <div
              key={seg.title}
              className="flex items-center justify-between px-2 py-2.5 border-b border-default hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-lg flex-shrink-0">{seg.icon}</span>
                {is_available_to_user && is_enabled ? (
                  <Link
                    href={seg.path}
                    className="text-sm font-medium hover:underline truncate"
                  >
                    {seg.title}
                  </Link>
                ) : (
                  <span className="text-sm font-medium truncate">
                    {seg.title}
                  </span>
                )}
              </div>

              <div className="flex-shrink-0">
                {is_available_to_user ? (
                  user_preference === null ? (
                    <span className="text-xs text-neutral-400 dark:text-neutral-500">
                      Default
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        if (updating || !seg.preference_key) return;
                        updatePreferences({
                          variables: {
                            key: seg.preference_key,
                            value: user_preference ? "false" : "true",
                          },
                        });
                      }}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        user_preference
                          ? "bg-primary-500"
                          : "bg-neutral-300 dark:bg-neutral-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                          user_preference
                            ? "translate-x-[18px]"
                            : "translate-x-[2px]"
                        }`}
                      />
                    </button>
                  )
                ) : (
                  <Popup
                    trigger={
                      <span className="text-xs font-medium text-amber-500 cursor-pointer hover:underline">
                        Upgrade
                      </span>
                    }
                    modal
                  >
                    <PremiumPopup
                      path={seg.path}
                      plan_required={seg.plan_required}
                    />
                  </Popup>
                )}
              </div>
            </div>
          );
        })}
        <div className="h-4" />
      </div>
    </div>
  );
}
