/**
 * ResearchMatrix component.
 * Renders a searchable, filterable audit table of platform post-death and inactivity policies.
 * Does NOT own study narrative prose, metadata, or FAQ accordions.
 */

"use client";

import { useMemo, useState } from "react";
import { PlatformAuditCategory, PlatformPolicyEntry } from "@/types/interfaces";
import { TbSearch, TbCircleCheck, TbAlertTriangle, TbX } from "react-icons/tb";

interface ResearchMatrixProps {
  entries: PlatformPolicyEntry[];
}

type PolicyFilter = "all" | "legacy" | "inactivity";

const CATEGORIES: Array<"All" | PlatformAuditCategory> = [
  "All",
  "Email & Cloud",
  "Social & Creator",
  "Developer & Domains",
  "Gaming & Media",
  "Security & Finance",
];

const RISK_BADGE: Record<PlatformPolicyEntry["inactivityRisk"], string> = {
  High: "bg-red-500/10 text-red-700 border-red-500/20",
  Moderate: "bg-clay/15 text-clay border-clay/25",
  Low: "bg-sage/15 text-sage border-sage/25",
};

export default function ResearchMatrix({ entries }: ResearchMatrixProps) {
  const [selectedCategory, setSelectedCategory] = useState<"All" | PlatformAuditCategory>("All");
  const [policyFilter, setPolicyFilter] = useState<PolicyFilter>("all");
  const [query, setQuery] = useState("");

  const filteredEntries = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return entries.filter((entry) => {
      if (selectedCategory !== "All" && entry.category !== selectedCategory) return false;
      if (policyFilter === "legacy" && entry.legacySupportLevel !== "Native Tool") return false;
      if (policyFilter === "inactivity" && entry.inactivityRisk === "Low") return false;
      if (!normalized) return true;
      return (
        entry.platform.toLowerCase().includes(normalized) ||
        entry.category.toLowerCase().includes(normalized) ||
        entry.nativeLegacyTool.toLowerCase().includes(normalized) ||
        entry.heirAccessPolicy.toLowerCase().includes(normalized) ||
        entry.notes.toLowerCase().includes(normalized)
      );
    });
  }, [entries, selectedCategory, policyFilter, query]);

  return (
    <section id="audit-matrix" className="w-full bg-cream py-16 sm:py-24 px-4 sm:px-6 scroll-mt-24">
      <div className="max-w-7xl mx-auto flex flex-col gap-7">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex flex-col gap-2.5 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-clay">
              Interactive Dataset ({entries.length} Platforms)
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-forest leading-tight">
              What Each Platform Does
            </h2>
            <p className="text-sm sm:text-base text-forest/75 font-medium leading-relaxed">
              Filter by category or search any service to check deletion timers, legacy tools, and what your family needs to get in.
            </p>
          </div>

          <div className="relative w-full lg:w-80">
            <TbSearch className="w-4 h-4 text-forest/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Google, Apple, Steam, Coinbase..."
              aria-label="Search audited platforms"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-parchment/70 border border-forest/15 text-sm text-forest placeholder:text-forest/40 focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border active:scale-[0.98] focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    active
                      ? "bg-forest text-cream border-forest"
                      : "bg-parchment/60 text-forest/75 border-forest/10 hover:bg-parchment"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Policies" },
              { id: "legacy", label: "Has Legacy Tool" },
              { id: "inactivity", label: "Deletes When Idle" },
            ].map((item) => {
              const active = policyFilter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPolicyFilter(item.id as PolicyFilter)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border active:scale-[0.98] focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    active
                      ? "bg-primary text-white border-primary"
                      : "bg-cream text-forest/70 border-forest/15 hover:bg-parchment/60"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="overflow-x-auto border border-forest/10 rounded-2xl bg-parchment/40">
          <table className="min-w-full divide-y divide-forest/10 text-left border-collapse">
            <thead>
              <tr className="bg-parchment/90 text-xs uppercase tracking-wider font-bold text-forest/55">
                <th className="px-5 py-4">Platform</th>
                <th className="px-5 py-4">Deletes After</th>
                <th className="px-5 py-4">Built-in Legacy Tool</th>
                <th className="px-5 py-4">If Nothing Was Set Up</th>
                <th className="px-5 py-4">Can Someone Take Over?</th>
                <th className="hidden xl:table-cell px-5 py-4">Good to Know</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest/10 text-sm">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-forest/60 font-medium">
                    No platforms matched your filters. Try clearing the search box or switching to All Policies.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((row) => (
                  <tr key={row.platform} className="hover:bg-parchment/45 transition-colors align-top">
                    <td className="px-5 py-4">
                      <div className="font-bold text-forest">{row.platform}</div>
                      <div className="text-xs text-forest/50 font-semibold mt-0.5">{row.category}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${RISK_BADGE[row.inactivityRisk]}`}
                      >
                        {row.inactivityDeletion}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-forest/85">
                      <span className="inline-flex items-center gap-1.5">
                        {row.legacySupportLevel === "Native Tool" && (
                          <TbCircleCheck className="w-4 h-4 text-sage shrink-0" />
                        )}
                        {row.legacySupportLevel === "Partial / Offline" && (
                          <TbAlertTriangle className="w-4 h-4 text-clay shrink-0" />
                        )}
                        {row.legacySupportLevel === "None" && (
                          <TbX className="w-4 h-4 text-red-500 shrink-0" />
                        )}
                        <span>{row.nativeLegacyTool}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-forest/80 font-medium max-w-xs">{row.heirAccessPolicy}</td>
                    <td className="px-5 py-4 font-semibold text-forest/80">{row.accountTransferable}</td>
                    <td className="hidden xl:table-cell px-5 py-4 text-xs text-forest/65 font-medium max-w-sm leading-relaxed">
                      {row.notes}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-forest/55 font-medium">
          Showing {filteredEntries.length} of {entries.length} platforms based on their 2026 help docs and terms of service.
        </p>
      </div>
    </section>
  );
}
