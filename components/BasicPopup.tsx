import { twMerge } from "tailwind-merge";

export default function BasicPopup({
  open,
  setOpen,
  children,
  bg_className,
  popup_className,
}: {
  open: any;
  setOpen: (open: any) => void;
  children: React.ReactNode;
  bg_className?: string;
  popup_className?: string;
}) {
  return (
    open && (
      <div
        className={twMerge(
          "absolute top-0 left-0 right-0 bottom-0 p-4 flex flex-col items-center justify-center bg-black/80 overflow-x-hidden",
          bg_className
        )}
        onClick={() => {
          setOpen(null);
        }}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={twMerge(
            "bg-white dark:bg-neutral-900 p-4 rounded-sm shadow-md w-full max-w-fit",
            popup_className
          )}
        >
          {children}
        </div>
      </div>
    )
  );
}
