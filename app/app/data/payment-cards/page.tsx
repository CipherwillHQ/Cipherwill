
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import CardsList from "./CardsList";
import CreateCard from "./CreateCard";


export default function PaymentCards() {
  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Payment Cards">
        <CreateCard />
      </DesktopAndMobilePageHeader>
      <div className="px-2 sm:px-4">
        <CardsList />
      </div>
    </div>
  );
}
