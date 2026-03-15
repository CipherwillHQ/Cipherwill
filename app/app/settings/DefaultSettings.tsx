import Appearance from "./Appearance";

export default function DefaultSettings() {
  return (
    <div className="flex flex-col p-2 gap-4">
      {/* <div className="flex items-center justify-between bg-secondary p-4 w-full max-w-2xl rounded-md border border-default">
        <div className="flex items-center gap-2">
          <MdOutlineSdStorage size={22} />
          Cipherwill Storage Usage
        </div>

        <Link href="/app/usage" className="text-sm hover:underline">
          See Usage
        </Link>
      </div> */}
      <Appearance />
    </div>
  );
}
