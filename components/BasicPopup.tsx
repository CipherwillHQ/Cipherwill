export default function BasicPopup({ open, setOpen, children }) {
  return (
    open && (
      <div
        className="absolute top-0 left-0 right-0 bottom-0 p-4 flex flex-col items-center justify-center bg-black/80 overflow-x-hidden"
        onClick={() => {
          setOpen(null);
        }}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="bg-white dark:bg-neutral-900 p-4 rounded-sm shadow-md w-full max-w-fit"
        >
          {children}
        </div>
      </div>
    )
  );
}
