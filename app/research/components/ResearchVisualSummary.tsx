/**
 * ResearchVisualSummary component.
 * Renders headline metrics alongside proportional bar breakdowns computed from the audit dataset.
 * Does NOT own raw platform rows, search filters, or long-form prose sections.
 */

import { PlatformPolicyEntry, ResearchStat } from "@/types/interfaces";

interface ResearchVisualSummaryProps {
  keyFindings: ResearchStat[];
  entries?: PlatformPolicyEntry[];
}

export default function ResearchVisualSummary({
  keyFindings,
  entries = [],
}: ResearchVisualSummaryProps) {
  const total = entries.length;
  const withLegacyTool = entries.filter((item) => item.legacySupportLevel === "Native Tool").length;
  const offlineOnly = entries.filter((item) => item.legacySupportLevel === "Partial / Offline").length;
  const noLegacyTool = entries.filter((item) => item.legacySupportLevel === "None").length;
  const inactivityRiskCount = entries.filter((item) => item.inactivityRisk !== "Low").length;

  const pct = (count: number) => (total > 0 ? Math.round((count / total) * 100) : 0);

  return (
    <section
      id="key-findings"
      className="w-full bg-[#F4F1EA] text-forest border-y border-forest/10 py-14 sm:py-20 px-4 sm:px-6 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-forest/10 pb-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-clay">
              Summary Data
            </span>
            <h2 className="font-playfair text-2xl sm:text-4xl font-bold leading-tight text-forest">
              What the Numbers Show
            </h2>
          </div>
          {total > 0 && (
            <p className="text-sm text-forest/65 font-medium max-w-md">
              Calculated directly across all {total} audited platforms in the dataset below.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {keyFindings.map((stat) => (
            <div
              key={stat.label}
              className="bg-cream border border-forest/10 rounded-2xl p-6 flex flex-col gap-2"
            >
              <span className="font-gilroy tabular-nums tracking-tight text-3xl sm:text-4xl font-extrabold text-primary">
                {stat.value}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-forest">
                {stat.label}
              </h3>
              <p className="text-xs sm:text-sm text-forest/70 font-medium leading-relaxed">
                {stat.context}
              </p>
            </div>
          ))}
        </div>

        {total > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            <div className="bg-cream border border-forest/10 rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-wider font-bold text-forest/55">
                <span>Pre-Death Legacy Handoff Support</span>
                <span>{total} Platforms</span>
              </div>
              <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-forest/10">
                <div
                  className="bg-sage h-full"
                  style={{ width: `${pct(withLegacyTool)}%` }}
                  title={`Built-in online tool: ${withLegacyTool}`}
                />
                <div
                  className="bg-clay h-full"
                  style={{ width: `${pct(offlineOnly)}%` }}
                  title={`Offline kit only: ${offlineOnly}`}
                />
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-forest/80">
                <span className="inline-flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sage" />
                  Built-in online tool: {withLegacyTool} ({pct(withLegacyTool)}%)
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-clay" />
                  Offline PDF kit only: {offlineOnly} ({pct(offlineOnly)}%)
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-forest/20" />
                  No pre-death tool: {noLegacyTool} ({pct(noLegacyTool)}%)
                </span>
              </div>
            </div>

            <div className="bg-cream border border-forest/10 rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-wider font-bold text-forest/55">
                <span>Inactivity Deletion or Freeze Risk</span>
                <span>{total} Platforms</span>
              </div>
              <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-forest/10">
                <div
                  className="bg-[#C87941] h-full"
                  style={{ width: `${pct(inactivityRiskCount)}%` }}
                  title={`Has inactivity deletion or freeze rule: ${inactivityRiskCount}`}
                />
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-forest/80">
                <span className="inline-flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C87941]" />
                  Deletes or freezes idle accounts: {inactivityRiskCount} ({pct(inactivityRiskCount)}%)
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-forest/20" />
                  No set inactivity timer: {total - inactivityRiskCount} ({pct(total - inactivityRiskCount)}%)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
