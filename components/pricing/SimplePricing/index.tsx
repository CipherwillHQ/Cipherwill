import CompareTable from "./CompareTable";
import PriceTeaser from "./PriceTeaser";
import ScrollDownButton from "./ScrollDownButton";

export default function SimplePricing() {
  return (
    <div className="p-4 w-full max-w-6xl mx-auto font-medium">
      <PriceTeaser/>      
      <ScrollDownButton />
      <CompareTable />
    </div>
  );
}
