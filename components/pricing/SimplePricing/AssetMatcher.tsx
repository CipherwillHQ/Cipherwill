/**
 * AssetMatcher.tsx
 * What it does: Renders an interactive asset selection widget to help users identify their planning needs.
 * What it owns: Visual representation of asset types (Pill chips, icons, hover/selected states, animations).
 * What it does NOT do: Hold global state or directly render plan prices. It receives selection callbacks.
 */

"use client";

import { motion } from "framer-motion";
import { 
  TbKey, 
  TbNotebook, 
  TbMail, 
  TbDeviceMobile, 
  TbBuildingBank, 
  TbCurrencyEthereum, 
  TbFolder, 
  TbUserPlus 
} from "react-icons/tb";

export interface AssetOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  isPremium: boolean;
  tooltip: string;
}

export const assetOptions: AssetOption[] = [
  { id: "passwords", label: "Passwords", icon: TbKey, isPremium: false, tooltip: "Safe, encrypted password lockers." },
  { id: "notes", label: "Secure Notes", icon: TbNotebook, isPremium: false, tooltip: "Wills, final wishes, and text archives." },
  { id: "emails", label: "Emails", icon: TbMail, isPremium: false, tooltip: "Social media and account inheritance." },
  { id: "devices", label: "Device Locks", icon: TbDeviceMobile, isPremium: false, tooltip: "Instructions to unlock laptops and phones." },
  { id: "finance", label: "Traditional Bank Accounts", icon: TbBuildingBank, isPremium: false, tooltip: "Traditional bank deposits and assets." },
  { id: "web3", label: "Web3 & Crypto Wallet Keys", icon: TbCurrencyEthereum, isPremium: true, tooltip: "Cold wallet seeds, DeFi tokens, Web3 keys." },
  { id: "files", label: "File Storage & Documents", icon: TbFolder, isPremium: true, tooltip: "Scanned property deeds, death certificates, legacy PDFs." },
  { id: "perItemBeneficiary", label: "Per-Item Beneficiaries", icon: TbUserPlus, isPremium: true, tooltip: "Assign unique beneficiaries to specific secrets." }
];

interface AssetMatcherProps {
  selectedAssets: string[];
  onToggleAsset: (id: string) => void;
}

export default function AssetMatcher({ selectedAssets, onToggleAsset }: AssetMatcherProps) {
  const selectedPremium = assetOptions
    .filter(opt => selectedAssets.includes(opt.id))
    .some(opt => opt.isPremium);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 mb-10 select-none">
      <div className="bg-[#F4F1EA] border border-forest/10 rounded-2xl p-6 md:p-8">
        <div className="text-center mb-6">
          <h3 className="font-playfair text-xl sm:text-2xl font-bold text-forest mb-2">
            What are you planning to protect?
          </h3>
          <p className="text-sm font-gilroy text-forest/70 font-medium max-w-lg mx-auto">
            Click on the digital assets you wish to safeguard. We'll automatically identify the most efficient plan for your legacy.
          </p>
        </div>

        {/* Asset Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {assetOptions.map((asset) => {
            const isSelected = selectedAssets.includes(asset.id);
            const Icon = asset.icon;

            return (
              <motion.button
                key={asset.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onToggleAsset(asset.id)}
                className={`relative flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-200 outline-none focus:ring-2 focus:ring-[#003ecb] focus:ring-offset-2 ${
                  isSelected
                    ? "bg-forest/10 border-forest text-forest font-semibold"
                    : "bg-white/80 border-forest/10 text-forest/70 hover:border-forest/30 font-medium"
                }`}
                title={asset.tooltip}
              >
                <div className="mb-2">
                  <Icon size={24} className={isSelected ? "text-[#003ecb]" : "text-forest/65"} />
                </div>
                <span className="text-xs sm:text-sm font-gilroy">{asset.label}</span>
                {asset.isPremium && (
                  <span className="absolute top-1.5 right-1.5 text-[9px] uppercase tracking-wide bg-clay/20 text-accent-800 px-1.5 py-0.5 rounded-full font-bold">
                    Pro
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Dynamic Advice Recommendation */}
        <motion.div 
          layout
          className="mt-6 pt-6 border-t border-forest/10 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="text-left">
            <span className="text-xs uppercase font-mono tracking-widest text-forest/50 font-bold">
              Dynamic Recommendation
            </span>
            <div className="mt-1 flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${selectedPremium ? "bg-clay" : "bg-sage"}`} />
              <p className="text-sm font-gilroy font-semibold text-forest">
                {selectedAssets.length === 0 ? (
                  "Select assets above to find your ideal plan."
                ) : selectedPremium ? (
                  "Premium Plan ($40/yr) — Recommended for secure files & Web3 encryption."
                ) : (
                  "Lifetime Free Plan ($0) — Perfect for your selected basic planning items."
                )}
              </p>
            </div>
          </div>
          {selectedAssets.length > 0 && (
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const targetId = selectedPremium ? "infinite-card" : "free-card";
                document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-xs font-semibold text-[#003ecb] hover:text-[#004eff] underline flex items-center gap-1 cursor-pointer"
            >
              Reveal Plan Card →
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
