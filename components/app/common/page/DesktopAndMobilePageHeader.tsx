import MobilePageHeader from "@/components/mobile/MobilePageHeader";
import Link from "next/link";
import { IoArrowBackCircleOutline } from "react-icons/io5";

export default function DesktopAndMobilePageHeader({
  title,
  children = null,
  backPath,
}: {
  title: string;
  children?: React.ReactNode;
  backPath?: string;
}) {
  return (
    <>
      <MobilePageHeader title={title} path={backPath}>
        {children}
      </MobilePageHeader>

      <div className="hidden sm:flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          {backPath && (
            <Link href={backPath}>
              <IoArrowBackCircleOutline size={25} />
            </Link>
          )}
          <h1 className="text-2xl font-semibold">{title}</h1>
        </div>
        {children}
      </div>
    </>
  );
}
