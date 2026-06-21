
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import CardsList from "./CardsList";


export default function PaymentCards() {
  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Payment Cards" />
      <div className="px-4">
        <CardsList />
      </div>
    </div>
  );
}
