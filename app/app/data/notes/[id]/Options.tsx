import getTimeAgo from "@/common/time/getTimeAgo";
import { FiMoreHorizontal } from "react-icons/fi";
import Popup from "reactjs-popup";
import DeleteButton from "./DeleteButton";

export default function Options({ model }: { model: any }) {
  return (
    <Popup
      trigger={
        <button className="px-2">
          <FiMoreHorizontal size={22} />
        </button>
      }
      position="bottom right"
    >
      {/* @ts-ignore */}
      {(close) => {
        return (
          <div className="bg-white dark:bg-gray-700 text-black dark:text-white rounded-sm shadow-lg w-full">
            <button
              className="p-2 w-full text-left"
              onClick={() => {
                document.getElementById("note-title")?.focus();
                close();
              }}
            >
              Rename
            </button>
            <DeleteButton id={model.id} />

            <div className="my-2 p-4 border-t border-default">
              <div className="text-xs">
                Created at: {getTimeAgo(parseInt(model?.created_at || 0))}
              </div>
              <div className="text-xs">
                Updated at: {getTimeAgo(parseInt(model?.updated_at || 0))}
              </div>
            </div>
          </div>
        );
      }}
    </Popup>
  );
}
