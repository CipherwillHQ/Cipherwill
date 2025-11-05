import Link from "next/link";
import { IoArrowBackCircleOutline } from "react-icons/io5";

export default function MobilePageHeader({
  title = null,
  path = "/app",
  children = null,
}:{
  title?: string | null;
  path?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="sm:hidden sticky top-0 z-10 p-4 w-screen bg-secondary border-b border-default mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href={path} className="pr-2">
            <IoArrowBackCircleOutline size={25} />
          </Link>
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
