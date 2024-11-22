import SimpleButton from "@/components/common/SimpleButton";
import DevOnly from "@/components/debug/DevOnly";

export default function PremiumPopup({
  path,
  plan_required,
}: {
  path: string;
  plan_required: string;
}) {
  return (
    <div className="flex flex-col gap-2 bg-white dark:bg-neutral-800 text-black dark:text-white rounded-md p-4 w-full max-w-sm">
      <h2 className="text-xl font-semibold">Premium Segment</h2>
      <div>
        You need to upgrade to {plan_required} plan to access this segment.
      </div>
      <DevOnly>
        <SimpleButton href={path} className="w-full">
          Access For Dev
        </SimpleButton>
      </DevOnly>
      <SimpleButton href="/app/billing" className="w-full">
        Upgrade
      </SimpleButton>
    </div>
  );
}
