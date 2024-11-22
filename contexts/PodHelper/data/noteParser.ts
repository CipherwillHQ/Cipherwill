import { NOTE_TYPE, NOTE_TYPE_v0_0_1 } from "@/types/pods/NOTE";

export default function noteParser({
  data_version,
  data,
}: {
  data_version: string;
  data: NOTE_TYPE_v0_0_1 | NOTE_TYPE;
}) {
  // current expected version is 0.0.2

  // if note is of version 0.0.1 then return the string to
  // object with content property which is the latest version
  if (data_version === "0.0.1") {
    return {
      content: (data as string).replaceAll("\n", "</br>"),
    };
  }

  if (data_version === "0.0.2") {
    return data;
  }
}
