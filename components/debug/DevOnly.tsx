export default function DevOnly({ children }) {
  if (process.env.NEXT_PUBLIC_BUILD_ENV === "production") return null;

  return (
    <div className="border border-yellow-500 -outline-offset-1">
      <div className="relative -mt-4 text-xs bg-yellow-400/50 px-[5px] rounded-full w-min right-0">
        DEV
      </div>
      {children}
    </div>
  );
}
