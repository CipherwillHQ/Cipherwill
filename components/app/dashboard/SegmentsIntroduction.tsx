import SimpleButton from "@/components/common/SimpleButton";
import { TbCell } from "react-icons/tb";

export default function SegmentsIntroduction() {
  return (
    <div className="flex flex-col gap-4 bg-secondary border border-default rounded-md p-6 h-96 overflow-auto customScrollbar justify-center items-center text-center">
      <TbCell size={48} className="text-primary" />
      <h2 className="font-semibold text-xl">Discover Segments</h2>
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
