import { BiCheck, BiCross, BiX } from "react-icons/bi";

const compareTable = [
  {
    section: "General",
  },
  {
    name: "Data",
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
    name: "Data",
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
    name: "Storage",
    free: <BiX size={25} className="text-red-500" />,
    premium: <BiCheck size={25} className="text-green-700" />,
  },
  {
    section: "Platform",
  },
  {
    name: "For",
    free: "Basic digital inheritance planning",
    premium: "Protect all digital assets and full platform access",
  },
  {
    name: "Support",
    free: "Chat support",
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
    <div className="overflow-auto md:overflow-visible customScrollbar my-20">
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
              <div className="flex flex-1 items-end min-w-60 pt-8 mr-2 min-h-24 font-semibold text-neutral-500 bg-white">
                <span className="pl-2 pb-4">{item.section}</span>
              </div>
              <div className="flex flex-1 opacity-0">{item.section}</div>
              <div className="flex flex-1 opacity-0">{item.section}</div>
            </div>
          );
        }
        return (
          <div key={index} className="flex w-min sm:w-full border-b py-1">
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
  );
}
