/**
 * CompareTable.tsx
 * What it does: Renders a detailed, interactive feature comparison table.
 * What it owns: Feature items mapping, collapsible sections, desktop hover highlights, and modal explanation popovers.
 * What it does NOT do: Handle payment checkouts or primary card layout rendering.
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TbCheck, TbX, TbInfoCircle, TbChevronDown, TbChevronUp } from "react-icons/tb";

interface RowItem {
  name: string;
  free: string | boolean;
  premium: string | boolean;
  desc?: string;
}

interface TableSection {
  title: string;
  rows: RowItem[];
}

const compareData: TableSection[] = [
  {
    title: "General & Storage",
    rows: [
      { name: "Beneficiaries", free: "Up to 5", premium: "Unlimited", desc: "How many people can receive pieces of your secure legacy data." },
      { name: "File Storage & Deeds", free: false, premium: "1 GB Space", desc: "Upload land titles, scanned wills, family documents, or safe legacy PDFs." },
      { name: "Data Backup Protection", free: false, premium: true, desc: "Shattered, encrypted backup shards spread across decentralized networks." },
      { name: "Per-Item Allocation", free: false, premium: true, desc: "Assign specific assets to specific executors rather than sharing everything." },
    ],
  },
  {
    title: "Asset Vault Support",
    rows: [
      { name: "Secure Notes & Wishes", free: true, premium: true, desc: "Plaintext wills, guidance letters, wishes, or legacy coordinates." },
      { name: "Passwords & Passcodes", free: true, premium: true, desc: "Logins to lockboxes, software, profiles, and key domains." },
      { name: "Traditional Finance Logs", free: true, premium: true, desc: "Details on banks, checking accounts, stock plans, and insurance." },
      { name: "Web3 Crypto & Seeds", free: false, premium: true, desc: "Encrypted offline cold storage for ledger phrases, wallet keys, and DeFi stakes." },
    ],
  },
  {
    title: "Communications & Alerts",
    rows: [
      { name: "Failsafe Communications", free: "Email Only", premium: "Multi-Channel", desc: "Account checkins and dead man pings via Email, Call, SMS, or WhatsApp." },
      { name: "Support Tier", free: "Standard Support", premium: "Priority Live Chat", desc: "Response speeds and channel access when resolving setup or handoffs." },
      { name: "Beta Feature Access", free: false, premium: true, desc: "Early access to upcoming legacy templates, integrations, and apps." },
    ],
  },
];

export default function CompareTable() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [activeExplain, setActiveExplain] = useState<RowItem | null>(null);

  const toggleSection = (title: string) => {
    setCollapsed(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const renderValue = (val: string | boolean) => {
    if (typeof val === "boolean") {
      return val 
        ? <TbCheck size={20} className="text-sage mx-auto" /> 
        : <TbX size={18} className="text-error mx-auto" />;
    }
    return <span className="font-semibold text-xs sm:text-sm text-forest/85">{val}</span>;
  };

  return (
    <div id="compare-table" className="mx-auto max-w-5xl px-4 py-12 select-none">
      <div className="text-center mb-8">
        <h3 className="font-playfair text-xl sm:text-2xl font-bold text-forest mb-2">
          Compare Features In Detail
        </h3>
        <p className="text-xs sm:text-sm font-gilroy font-semibold text-forest/50">
          Hover rows or click info icons to see feature explanations.
        </p>
      </div>

      <div className="bg-white border border-forest/10 rounded-2xl overflow-hidden">
        {/* Table Header Row */}
        <div className="flex items-center bg-[#F4F1EA] p-4 font-gilroy font-bold text-forest border-b border-forest/10 text-xs sm:text-sm">
          <div className="flex-[2] text-left">Feature Details</div>
          <div className="flex-1 text-center">Lifetime Free</div>
          <div className="flex-1 text-center text-[#003ecb]">Premium</div>
        </div>

        {compareData.map((sect) => {
          const isCollapsed = collapsed[sect.title];
          return (
            <div key={sect.title} className="border-b border-forest/10 last:border-0">
              {/* Accordion Group Header */}
              <button
                onClick={() => toggleSection(sect.title)}
                className="w-full flex items-center justify-between p-4 bg-gray-50/70 hover:bg-gray-100/50 transition-colors text-left border-b border-forest/5 cursor-pointer outline-none"
              >
                <span className="font-gilroy font-extrabold text-xs sm:text-sm text-forest/80 uppercase tracking-wider">
                  {sect.title}
                </span>
                {isCollapsed ? <TbChevronDown size={18} className="text-forest/60" /> : <TbChevronUp size={18} className="text-forest/60" />}
              </button>

              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {sect.rows.map((row, rIdx) => (
                      <div
                        key={rIdx}
                        className="flex items-center p-4 border-b border-forest/5 last:border-0 hover:bg-forest/5 transition-colors text-xs sm:text-sm group"
                      >
                        <div className="flex-[2] flex items-center gap-1.5 text-left font-gilroy font-medium text-forest/90">
                          <span>{row.name}</span>
                          {row.desc && (
                            <button
                              onClick={() => setActiveExplain(row)}
                              className="text-forest/30 hover:text-[#003ecb] transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-offset-1 focus:ring-[#003ecb] rounded-full"
                              title="Click for details"
                            >
                              <TbInfoCircle size={16} />
                            </button>
                          )}
                        </div>
                        <div className="flex-1 text-center">{renderValue(row.free)}</div>
                        <div className="flex-1 text-center font-semibold text-[#003ecb]">{renderValue(row.premium)}</div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Interactive Detail Explainer Modal */}
      <AnimatePresence>
        {activeExplain && (
          <div className="fixed inset-0 z-[350] flex items-center justify-center p-4 bg-forest/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border border-forest/10 p-6 rounded-2xl max-w-sm w-full shadow-level-3 relative"
            >
              <h4 className="font-playfair text-lg font-bold text-forest mb-2">
                {activeExplain.name}
              </h4>
              <p className="text-sm font-gilroy font-medium text-forest/70 leading-relaxed mb-4">
                {activeExplain.desc}
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setActiveExplain(null)}
                  className="px-4 py-1.5 bg-[#003ecb] text-white font-gilroy font-semibold rounded-xl text-xs hover:bg-[#004eff] cursor-pointer outline-none"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
