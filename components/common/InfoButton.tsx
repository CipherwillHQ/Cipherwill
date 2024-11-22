import { TbInfoCircle } from "react-icons/tb";
import Popup from "reactjs-popup";
import { PopupPosition } from "reactjs-popup/dist/types";
import { ClassNameValue, twMerge } from "tailwind-merge";

export default function InfoButton({
  icon = <TbInfoCircle />,
  triggerTitle,
  title,
  description,
  triggerClassName,
  bodyClassName,
  allowed_positions = [
    "top center",
    "left center",
    "right center",
    "bottom center",
  ],
}: {
  icon?: JSX.Element;
  triggerTitle?: string;
  title: string;
  description: string;
  triggerClassName?: ClassNameValue;
  bodyClassName?: ClassNameValue;
  allowed_positions?: PopupPosition | PopupPosition[];
}) {
  return (
    <div className="">
      <Popup
        trigger={
          <button
            className={twMerge(
              "flex items-center gap-2 border border-default rounded-full px-4 py-1",
              triggerClassName
            )}
          >
            {icon} {triggerTitle}
          </button>
        }
        position={allowed_positions}
        on={["hover", "focus"]}
        contentStyle={{
          boxShadow: "none",
          width: "350px",
        }}
      >
        <div
          className={twMerge(
            "rounded-md bg-white text-black p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
            bodyClassName
          )}
        >
          <h3 className="font-bold text-lg">{title}</h3>
          <div className="py-2 font-medium">{description}</div>
        </div>
      </Popup>
    </div>
  );
}
