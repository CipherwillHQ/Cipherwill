import getAllCountryCodes from "@/common/country/getAllCountryCodes";
import Select from "@/components/ui/Select";
import { BiErrorCircle } from "react-icons/bi";

export default function Country({
    country,
    setCountry,
}) {
  return (
    <>
      <label className="mt-2 py-3 px-1 font-semibold text-sm">Country</label>
      <div className="flex justify-between items-center w-full">
        <Select
          value={country}
          onChange={(val) => setCountry(val)}
          className="w-full bg-neutral-100 dark:bg-neutral-800"
          placeholder="Select Country"
          options={getAllCountryCodes().map((country) => {
            return {
              value: country.code,
              label: country.name,
            };
          })}
        />
        {country === "" && <BiErrorCircle className="text-red-500 m-1" />}
      </div>
    </>
  );
}
