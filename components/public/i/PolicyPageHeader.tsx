export default function PolicyPageHeader({ title }: { title: string }) {
  return (
    <div
      className={`pt-40 pb-20 px-4 w-full max-w-7xl mx-auto text-center font-playfair`}
    >
      <h1 className="text-6xl sm:text-8xl md:text-9xl font-bold whitespace-pre-line italic">{title}</h1>
    </div>
  );
}
