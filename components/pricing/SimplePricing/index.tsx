import ABTest from "@/components/wrappers/ABTest";
import CompareTable from "./CompareTable";
import PriceTeaserA from "./PriceTeaser";
import PriceTeaserB from "./PriceTeaserB";
import ScrollDownButton from "./ScrollDownButton";

export default function SimplePricing() {
  return (
    <div className="p-4 w-full max-w-7xl mx-auto font-medium">
      <ABTest
        flagName="pricing-teaser-test"
        variantA={<PriceTeaserA />}
        variantB={<PriceTeaserB />}
      />
      {/* <PriceTeaser/>       */}
      <ScrollDownButton />
      <CompareTable />
    </div>
  );
}
