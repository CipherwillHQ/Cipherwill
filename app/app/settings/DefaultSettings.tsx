import SimpleButton from "@/components/common/SimpleButton";
import Appearance from "./Appearance";
import { TiDownloadOutline } from "react-icons/ti";
import { BiUserCircle } from "react-icons/bi";
import Link from "next/link";
import { MdOutlineSdStorage } from "react-icons/md";

export default function DefaultSettings() {
  return (
    <div className="flex flex-col p-2 gap-4">
      <div className="flex items-center justify-between bg-secondary p-4 w-full max-w-2xl rounded-md border border-default">
        <div className="flex items-center gap-2">
          <BiUserCircle size={22} />
          Profile Settings
        </div>

        <SimpleButton href="/app/profile">Edit Profile</SimpleButton>
      </div>
      <div className="flex items-center justify-between bg-secondary p-4 w-full max-w-2xl rounded-md border border-default">
        <div className="flex items-center gap-2">
          <TiDownloadOutline size={22} />
          Data backup
        </div>

        <Link href="/app/backup" className="text-sm hover:underline">
          Backup Now
        </Link>
      </div>
      <div className="flex items-center justify-between bg-secondary p-4 w-full max-w-2xl rounded-md border border-default">
        <div className="flex items-center gap-2">
          <MdOutlineSdStorage size={22} />
          Cipherwill Storage Usage
        </div>

        <Link href="/app/usage" className="text-sm hover:underline">
          See Usage
        </Link>
      </div>
      <Appearance />
    </div>
  );
}
