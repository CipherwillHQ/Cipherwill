/**
 * Segments Management Page
 * What it does: Allows users to configure and toggle different digital asset segments (Notes, Passwords, etc.)
 * What it owns: User segment preference toggles and links to specific data segments
 * What it does NOT do: Does not store the segment data itself
 */

"use client";

import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import segments from "./segments";
import { useUserContext } from "@/contexts/UserSetupContext";
import Popup from "reactjs-popup";
import { useMutation, useQuery } from "@apollo/client/react";
import GET_PREFERENCES from "@/graphql/ops/auth/queries/GET_PREFERENCES";
import UPDATE_PREFERENCES from "@/graphql/ops/auth/mutations/UPDATE_PREFERENCES";
import GET_METAMODEL_TYPE_COUNTS from "@/graphql/ops/app/metamodel/queries/GET_METAMODEL_TYPE_COUNTS";
import Link from "next/link";
import PremiumPopup from "./PremiumPopup";
import { Divider, Segment } from "@/types/Segments";
import type {
  GetPreferencesQuery,
  UpdatePreferencesMutation,
  UpdatePreferencesVariables,
  GetMetamodelTypeCountsQuery,
} from "@/types/interfaces/metamodel";
import SuggestionBox from "@/components/app/dashboard/SuggestionBox";
import { TbAdjustments } from "react-icons/tb";

interface SegmentGroup {
  name: string;
  segments: Segment[];
}


const createTextMap: Record<string, string> = {
  notes: "Create Note",
  "email-accounts": "Create Email Account",
  "device-locks": "Create Device Lock",
  passwords: "Create Password",
  "seed-phrases": "Create Seed Phrase",
  "defi-staking": "Create DeFi Staking",
  "bank-accounts": "Create Bank Account",
  "payment-cards": "Create Payment Card",
  storage: "Upload File",
};

export default function Segments() {
  const { user } = useUserContext();
  const current_user_plan = user?.plan || "free";
  const { data, loading, error } =
    useQuery<GetPreferencesQuery>(GET_PREFERENCES);
  const [updatePreferences, { loading: updating }] = useMutation<
    UpdatePreferencesMutation,
    UpdatePreferencesVariables
  >(UPDATE_PREFERENCES);

  const { data: countsData } =
    useQuery<GetMetamodelTypeCountsQuery>(GET_METAMODEL_TYPE_COUNTS);
  const countMap: Record<string, number> = {};
  countsData?.getMetamodelTypeCounts?.forEach((item) => {
    countMap[item.type] = item.count;
  });

  if (loading)
    return (
      <div className="p-4 text-xs font-semibold text-neutral-500">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="p-4 text-xs font-semibold text-red-500">
        Error loading segments preference.
      </div>
    );

  const preferences = data?.getPreferences || {};

  // Group segments dynamically by divider headers
  const groups: SegmentGroup[] = [];
  let currentGroup: SegmentGroup | null = null;

  segments.forEach((item) => {
    if ("divider" in item) {
      const groupName = (item as Divider).divider;
      currentGroup = {
        name: groupName,
        segments: [],
      };
      groups.push(currentGroup);
    } else if (currentGroup) {
      currentGroup.segments.push(item as Segment);
    }
  });

  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Segments">
        <SuggestionBox triggerText="💡 Suggest a segment" />
      </DesktopAndMobilePageHeader>

      <div className="flex flex-col px-4 sm:px-6 pb-8 gap-6">
        {/* Uniform & Eye-Catching Reassurance Guide Panel (No shadow, no hover animation, global border) */}
        <div className="relative overflow-hidden rounded-2xl border border-default bg-clay/10 p-5 sm:p-6 transition-all duration-300">
          {/* Ambient subtle glow background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#7AA089]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#D4A390]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start gap-4">
            {/* Elegant Icon Badge */}
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#D4A390]/25 to-[#D4A390]/10 dark:from-[#D4A390]/30 dark:to-[#D4A390]/15 text-[#D4A390] dark:text-[#E2B7A6] flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
              <TbAdjustments className="w-5 h-5 stroke-2" />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5 mb-1.5 leading-snug">
                Customize Your Dashboard Experience
              </h2>
              <div className="text-sm font-medium text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-3xl">
                <p>
                  Turning a segment off simply hides it from your navigation
                  sidebar to keep your dashboard clean.
                </p>
                <p>
                  Your data is always 100% safe, and is never deleted or
                  modified when you turn a segment off.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Displaying Groups and Responsive Card Grids (4 cols then 3 then 2 then 1) */}
        {groups.map((group) => (
          <div key={group.name} className="flex flex-col gap-4">
            <div className="border-l-2 border-neutral-300 dark:border-neutral-700 pl-3 py-0.5">
              <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider leading-none">
                {group.name}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {group.segments.map((seg) => {
                const user_preference =
                  seg.preference_key === null
                    ? null
                    : preferences[seg.preference_key as string];

                const is_available_to_user =
                  current_user_plan === seg.plan_required ||
                  seg.plan_required === "free";

                const is_enabled =
                  user_preference === null || user_preference === true;

                const is_active = is_available_to_user && is_enabled;

                const itemCount = countMap[seg.metamodel_type] || 0;

                return (
                  <div
                    key={seg.title}
                    className="group flex flex-col h-full bg-secondary border border-default rounded-xl p-4 hover:border-primary-500/30 transition-all duration-300"
                  >
                    {/* Top Row: Icon, Heading, Premium Pill, Toggle/Upgrade */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      {/* Left: Icon and Heading */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-darkAccent text-neutral-600 dark:text-neutral-300 flex items-center justify-center text-lg transition-colors duration-200 group-hover:bg-primary-50 dark:group-hover:bg-primary-950/20 group-hover:text-primary-600 dark:group-hover:text-primary-400 shrink-0">
                          {seg.icon}
                        </div>
                        <h4 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate">
                          {seg.title}
                        </h4>
                      </div>

                      {/* Right: Premium Pill & Toggle/Upgrade Text */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Premium Pill (if premium) */}
                        {seg.plan_required === "premium" && (
                          <span className="text-[9px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/15">
                            Premium
                          </span>
                        )}

                        {/* Toggle or Upgrade (if locked, no toggle - shows Upgrade text) */}
                        {is_available_to_user ? (
                          seg.preference_key === null ? (
                            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-semibold bg-neutral-100 dark:bg-neutral-800/50 px-2 py-0.5 rounded">
                              Active
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
                              aria-label={`Toggle ${seg.title}`}
                              className={`relative inline-flex h-5 w-8.5 items-center rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-darkCanvas ${
                                is_enabled
                                  ? "bg-primary-600"
                                  : "bg-neutral-200 dark:bg-neutral-700"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                                  is_enabled
                                    ? "translate-x-[16px]"
                                    : "translate-x-[2px]"
                                }`}
                              />
                            </button>
                          )
                        ) : (
                          <Popup
                            trigger={
                              <button className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-500 hover:underline cursor-pointer transition-colors">
                                Upgrade
                              </button>
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

                    {/* Next line: Description (text-base font-medium as requested) */}
                    <p className="text-base font-medium text-neutral-500 dark:text-neutral-400 leading-relaxed mb-3 grow">
                      {seg.description}
                    </p>

                    {/* Bottom row: Create Link and/or item count */}
                    {(is_active || itemCount > 0) && (
                      <div className="pt-2 flex items-center justify-between">
                        {is_active ? (
                          <Link
                            href={seg.path}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-500 hover:underline transition-colors"
                          >
                            {createTextMap[seg.slug] || `Create ${seg.title}`}{" "}
                            <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                              →
                            </span>
                          </Link>
                        ) : (
                          <span />
                        )}
                        {itemCount > 0 && (
                          <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">
                            {itemCount} {itemCount === 1 ? "item" : "items"}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
