/**
 * SimplePricing/index.tsx
 * What it does: Coordinates and holds state for the redesigned, interactive pricing sections.
 * What it owns: Selected assets state, recommendation math, and sub-component layout ordering.
 * What it does NOT do: Directly write files or process checkouts.
 */

"use client";

import { useState } from "react";
import PricingHero from "./PricingHero";
import AssetMatcher, { assetOptions } from "./AssetMatcher";
import PricingCards from "./PricingCards";
import ScrollDownButton from "./ScrollDownButton";
import CompareTable from "./CompareTable";

export default function SimplePricing() {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

  const handleToggleAsset = (id: string) => {
    setSelectedAssets((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Determine if a premium asset has been selected to recommend the Infinite Plan
  const isPremiumRecommended = assetOptions
    .filter((opt) => selectedAssets.includes(opt.id))
    .some((opt) => opt.isPremium);

  return (
    <div className="w-full bg-cream text-forest">
      {/* Editorial Header Section */}
      <PricingHero />

      {/* Asset Matcher Interactive Widget */}
      <AssetMatcher 
        selectedAssets={selectedAssets} 
        onToggleAsset={handleToggleAsset} 
      />

      {/* Pricing Cards with dynamic recommendations */}
      <PricingCards isPremiumRecommended={isPremiumRecommended} />

      {/* Navigation Anchor */}
      <ScrollDownButton />

      {/* Full Feature Grid Layout */}
      <CompareTable />
    </div>
  );
}
