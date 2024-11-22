import { IoClose } from "react-icons/io5";

export default function BillingPopup() {
  return (
    <div className="flex flex-col w-full max-w-4xl max-h-[80vh] bg-white text-black rounded px-4 py-2 shadow">
      <div className="w-[5000px]" />
      <div className="w-full flex justify-between items-center">
        <div className="text-xl font-semibold">++</div>
        <IoClose size={25} />
      </div>
      <h2 className="text-xl font-semibold">Upgrade to Pro</h2>
      <div>
        Do more with unlimited blocks, files, automations & integrations
      </div>
      <div className="flex gap-2 h-screen">
        <div className="flex flex-col flex-1 bg-yellow-200">
          <div>Billed to</div>
          <input
            type="text"
            placeholder="Name"
            className="p-2 border rounded-md my-1"
          />
          <input
            type="text"
            placeholder="Business name"
            className="p-2 border rounded-md my-1"
          />
          <div>Payment details</div>
          <input
            type="text"
            placeholder="Card"
            className="p-2 border rounded-md my-1"
          />
          <div className="flex gap-2 justify-between">
            <input
              type="text"
              placeholder="CVC"
              className="p-2 border rounded-md my-1"
            />
            <input
              type="text"
              placeholder="Expiry"
              className="p-2 border rounded-md my-1"
            />
          </div>
          <input
            type="text"
            placeholder="Country"
            className="p-2 border rounded-md my-1"
          />

          <div className="text-xs">
            By providing your card information, you allow Notion Labs, Inc. to
            charge your card for future payments in accordance with their terms.
          </div>
        </div>
        <div className="flex flex-col flex-1 bg-red-200">
          Subscripion preview
          <button className="border mt-2 p-1 bg-blue-500 text-white">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  );
}
