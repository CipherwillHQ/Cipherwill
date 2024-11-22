import Image from "next/image";

export default function CoverImage({
  cover,
  title,
}: {
  cover: string;
  title: string;
}) {
  return (
    <div className="flex items-center justify-center py-5 px-2">
      <Image
        width={1280}
        height={1280}
        src={cover}
        alt={`Cover for ${title}`}
        className="rounded-lg max-h-[400px] object-cover object-center"
        priority
      />
    </div>
  );
}
