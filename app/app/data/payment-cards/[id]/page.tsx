import MobilePageHeader from "@/components/mobile/MobilePageHeader";
import MetaDetails from "./MetaDetails";
import PodDetails from "./PodDetails";

export default async function PasswordViewer({ params }) {
  const { id } = await params;
  return (
    <div className="w-full">
      <MobilePageHeader path="/app/data/payment-cards" />
      <div className="px-4 w-full">
        <MetaDetails id={id} />
        <div className="w-full max-w-md mt-4">
          <PodDetails id={id} />
        </div>
      </div>
    </div>
  );
}
