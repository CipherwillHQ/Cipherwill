import { Divider, Raw_Segment, Segment } from "@/types/Segments";
import segment_icons from "./segment_icons";
import segments_list from "./raw_segments_list";

const segments: (Divider | Segment)[] = segments_list.map((segment) => {
  const icon = segment_icons.find((i) => i.slug === (segment as Raw_Segment).slug)?.icon || <></>;
  return {
    ...segment,
    icon: icon,
  };
});

export default segments;
