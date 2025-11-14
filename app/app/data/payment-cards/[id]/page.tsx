import MobilePageHeader from "@/components/mobile/MobilePageHeader";
import PodDetails from "./PodDetails";
import DataHeader from "@/components/app/data/DataHeader";

export default async function PaymentCardViewer({ params }) {
  const { id } = await params;
  return (
    <div className="w-full">
      <MobilePageHeader path="/app/data/payment-cards" />
      <DataHeader metamode_id={id} metamodel_type="payment_card" />
      <PodDetails id={id} />
    </div>
  );
}
