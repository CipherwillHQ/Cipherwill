import PodDetails from "./PodDetails";
import DataHeader from "@/components/app/data/DataHeader";

export default async function PaymentCardViewer({ params }) {
  const { id } = await params;
  return (
    <div className="w-full">
      <DataHeader metamodel_id={id} metamodel_type="payment_card" backPath="/app/data/payment-cards" />
      <br />
      <PodDetails id={id} />
    </div>
  );
}
