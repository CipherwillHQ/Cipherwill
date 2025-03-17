import Link from "next/link";
import Popup from "reactjs-popup";
import getCountryNameByCode from "../../../common/country/getCountryNameByCode";

export default function CountryRestrictionPopup({
  open,
  closeModal,
  currentCountry = "US",
}: {
  open: boolean;
  closeModal: () => void;
  currentCountry: string;
}) {
  return (
    <Popup open={open} closeOnDocumentClick onClose={closeModal}>
      <div className="max-w-md bg-white p-2 rounded-sm">
        <h2
        className="text-lg font-bold text-gray-900 mb-2"
        >Country Restriction</h2>
        <div
        className="text-gray-800 my-4 "
        >
          You have subscribed to a plan that is for{" "}
          {getCountryNameByCode(currentCountry)}. If you want to switch to a
          different country, please cancel you current subscription and create a
          new one.
        </div>
        <div className="flex items-center justify-evenly gap-2">
          <button onClick={closeModal} className="bg-blue-300 w-full p-2">
            Ok
          </button>
          <Link href="/app/billing" className="w-full">
            <button className="bg-blue-300 w-full p-2">Go to billing</button>
          </Link>
        </div>
      </div>
    </Popup>
  );
}
