import { BiCheck, BiX } from "react-icons/bi";

const FactorNotAdded = (
  <div className="flex items-center justify-center">
    <BiX size={25} className="text-red-500" />{" "}
    <span className="hidden sm:block text-sm font-semibold">Not added</span>
  </div>
);
const FactorAdded = (
  <div className="flex items-center justify-center">
    <BiCheck size={25} className="text-green-700" />
    <span className="hidden sm:block text-sm font-semibold">Added</span>
  </div>
);

const table_data = [
  {
    me: FactorNotAdded,
    ben: FactorNotAdded,
    status: "Data is unencrypted for both accounts",
  },
  {
    me: FactorAdded,
    ben: FactorNotAdded,
    status:
      "Data is encrypted for your account, but the data you have uploaded for you beneficiary is still unencrypted",
  },
  {
    me: FactorNotAdded,
    ben: FactorAdded,
    status:
      "Data is not encrypted for your account but the data you have uploaded for you beneficiary is encrypted",
  },
  {
    me: FactorAdded,
    ben: FactorAdded,
    status:
      "Data is encrypted for both accounts. End-to-End Encryption for both accounts.",
  },
];
export default function EncryptionMetrix() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="flex flex-col gap-2 py-8">
        <h2 className="font-semibold text-2xl text-center">
          Encryption Status Metrix
        </h2>
        <p className="text-center max-w-2xl mx-auto font-medium">
          The following table shows the encryption status of your data with
          security factors. It is important to note that the encryption status
          of your data is dependent on the security factors you have selected
          for both your account and your beneficiary account.
        </p>
      </div>

      <div className="overflow-x-auto customScrollbar">
        <table className="min-w-full text-left text-sm whitespace-nowrap table-fixed">
          <thead className="uppercase tracking-wider text-xs sm:text-sm border-y bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 border-x text-wrap">
                My Account (Security Factor)
              </th>
              <th scope="col" className="px-6 py-4 border-x text-wrap">
                Beneficiary Account (Security Factor)
              </th>
              <th scope="col" className="px-6 py-4 border-x text-wrap">
                Encryption Status
              </th>
            </tr>
          </thead>

          <tbody>
            {table_data.map((data, index) => (
              <tr className="border-b" key={index}>
                <th scope="row" className="px-6 py-4 border-x">
                  {data.me}
                </th>
                <td className="px-6 py-4 border-x">{data.ben}</td>
                <td className="px-6 py-4 border-x whitespace-pre-wrap font-medium md:text-base">
                  {data.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
