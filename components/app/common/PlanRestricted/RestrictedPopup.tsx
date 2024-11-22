import SimpleButton from "@/components/common/SimpleButton";
import Popup from "reactjs-popup";

export default function RestrictedPopup({
  plan = "premium",
  trigger,
}: {
  plan?: string;
  trigger: JSX.Element;
}) {
  return (
    <Popup trigger={<div>{trigger}</div>} modal>
      <div className="bg-white rounded-md p-4 border border-default flex flex-col gap-2 max-w-sm">
        <div className="pb-2">
          This is a premium feature. Please upgrade your plan to access this
          feature.
        </div>
        <SimpleButton href="/app/billing">Upgrade to {plan}</SimpleButton>
      </div>
    </Popup>
  );
}
