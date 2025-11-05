import { BiCheck, BiCross, BiX } from "react-icons/bi";

const compareTable = [
  {
    section: "General",
  },
  {
    name: "Data Storage",
    free: "Unlimited",
    premium: "Unlimited",
  },
  {
    name: "Beneficiaries",
    free: 5,
    premium: "Unlimited",
  },
  // {
  //   name: "General Wishes",
  //   free: "Basic",
  //   premium: "Advance",
  // },
  // {
  //   name: "Health Wishes",
  //   free: <BiX size={25} className="text-red-500" />,
  //   premium: <BiCheck size={25} className="text-green-700" />,
  // },
  // {
  //   name: "End of Life Plans",
  //   free: <BiX size={25} className="text-red-500" />,
  //   premium: <BiCheck size={25} className="text-green-700" />,
  // },
  // {
  //   name: "Will schedule",
  //   free: "Annual",
  //   premium: "Custom",
  // },
  {
    name: "File Storage",
    free: <BiX size={25} className="text-red-500" />,
    premium: "1 GB",
  },
  {
    name: "Data backup",
    free: <BiX size={25} className="text-red-500" />,
    premium: <BiCheck size={25} className="text-green-700" />,
  },
  {
    section: "Segments",
  },
  {
    name: "Notes",
    free: <BiCheck size={25} className="text-green-700" />,
    premium: <BiCheck size={25} className="text-green-700" />,
  },
  {
    name: "Passwords",
    free: <BiCheck size={25} className="text-green-700" />,
    premium: <BiCheck size={25} className="text-green-700" />,
  },
  {
    name: "Email Accounts",
    free: <BiCheck size={25} className="text-green-700" />,
    premium: <BiCheck size={25} className="text-green-700" />,
  },
  {
    name: "Device Locks",
    free: <BiCheck size={25} className="text-green-700" />,
    premium: <BiCheck size={25} className="text-green-700" />,
  },
  {
    name: "Web3 Finance",
    free: <BiX size={25} className="text-red-500" />,
    premium: <BiCheck size={25} className="text-green-700" />,
  },
  {
    name: "Finance",
    free: <BiCheck size={25} className="text-green-700" />,
    premium: <BiCheck size={25} className="text-green-700" />,
  },
  {
    name: "File Storage",
    free: <BiX size={25} className="text-red-500" />,
    premium: <BiCheck size={25} className="text-green-700" />,
  },
  {
    section: "Platform",
  },
  
  {
    name: "Communications",
    free: "Email only",
    premium: "Email & Phone (Calls, SMS, WhatsApp)",
  },
  {
    name: "For",
    free: "Basic digital inheritance planning",
    premium: "Protect all digital assets and full platform access",
  },
  {
    name: "Support",
    free: "Email support",
    premium: "Live chat support",
  },
  {
    name: "Early access to new features",
    free: <BiX size={25} className="text-red-500" />,
    premium: <BiCheck size={25} className="text-green-700" />,
  },
];

export default function CompareTable() {
  return (
    <div className="my-20">
      {/* Mobile & Tablet Layout */}
      <div className="block md:hidden">
        {/* Mobile Header */}
        <div className="flex justify-center gap-3 mb-6 px-4">
          <div className="text-center px-4 py-3 bg-gray-50 rounded-lg flex-1 border border-gray-200">
            <h3 className="text-base font-semibold text-gray-800">Free</h3>
          </div>
          <div className="text-center px-4 py-3 bg-blue-50 rounded-lg flex-1 border border-blue-200">
            <h3 className="text-base font-semibold text-blue-800">Premium</h3>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-3 px-4">
          {compareTable.map((item, index) => {
            if (item.section) {
              return (
                <div key={index} className="mt-6 mb-3">
                  <h4 className="text-lg font-bold text-gray-800 border-b-2 border-blue-200 pb-2">
                    {item.section}
                  </h4>
                </div>
              );
            }
            return (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-3 text-sm leading-relaxed">
                  {item.name}
                </h5>
                <div className="flex gap-2">
                  <div className="flex-1 p-3 bg-gray-50 rounded-lg text-center border border-gray-100">
                    <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Free</div>
                    <div className="font-medium text-gray-800 flex justify-center items-center min-h-[28px] text-sm">
                      {item.free}
                    </div>
                  </div>
                  <div className="flex-1 p-3 bg-blue-50 rounded-lg text-center border border-blue-100">
                    <div className="text-xs text-blue-500 mb-1 font-medium uppercase tracking-wide">Premium</div>
                    <div className="font-medium text-blue-800 flex justify-center items-center min-h-[28px] text-sm">
                      {item.premium}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block overflow-auto md:overflow-visible customScrollbar">
        <div className="flex items-center sticky top-[63px]">
          <div className="flex flex-1 p-3 min-w-60">
            <span className="opacity-0">Feature</span>
          </div>
          <div className="flex flex-1 justify-center min-w-60 border-neutral-300 border-dashed border-x px-3 py-8 text-xl font-semibold bg-white">
            Free
          </div>
          <div className="flex flex-1 justify-center min-w-60 rounded-tr-lg px-3 py-8 text-xl font-semibold bg-white">
            Premium
          </div>
        </div>

        {compareTable.map((item, index) => {
          if (item.section) {
            return (
              <div key={index} className="flex items-end sticky top-[63px]">
                <div className="flex flex-1 items-end min-w-60 pt-8 mr-2 min-h-24 font-bold bg-white">
                  <span className="pl-2 pb-4">{item.section}</span>
                </div>
                <div className="flex flex-1 opacity-0">{item.section}</div>
                <div className="flex flex-1 opacity-0">{item.section}</div>
              </div>
            );
          }
          return (
            <div key={index} className="flex w-min sm:w-full border-gray-300 border-b py-1 hover:bg-gray-50 transition-colors">
              <div className="flex flex-1 min-w-60 border-neutral-200 font-semibold border-dashed border-r p-2">
                {item.name}
              </div>
              <div className="flex flex-1 justify-center min-w-60 text-gray-700 font-medium border-neutral-200 border-dashed border-r p-2 text-center">
                {item.free}
              </div>
              <div className="flex flex-1 justify-center min-w-60 text-gray-700 font-medium p-2 text-center">
                {item.premium}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
