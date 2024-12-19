import SimpleButton from "@/components/common/SimpleButton";
import { TbCell } from "react-icons/tb";

export default function SegmentsIntroduction() {
  return (
    <div className="flex flex-col gap-2 bg-secondary border border-default rounded-md p-2 h-min">
      <h2 className="font-semibold text-lg">Discover Segments</h2>
      <div className="text-sm">
        Segments help you organize your data. You can enable the segments you
        need and turn off the ones you don't.
      </div>
      <SimpleButton
        href={"/app/segments"}
        className="w-full p-2 flex items-center justify-center gap-2"
      >
        <TbCell size={20} />
        <span className="font-medium text-base sm:text-sm">Explore Segments</span>
      </SimpleButton>
    </div>
  );
}
