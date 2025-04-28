import Select from "@/components/ui/Select";
import { BiErrorCircle } from "react-icons/bi";

export default function DateOfBirth({ dob, setDob }) {
  const monthIndex = new Date(dob).getMonth() + 1; // Months are zero-based in JavaScript
  console.log("dob", dob);

  return (
    <>
      <label className="mt-2 py-3 px-1 font-semibold text-sm">
        Date of Birth
      </label>
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-center">
        {/* <input
              data-cy="dob-input"
              type="date"
              placeholder="Date of Birth"
              className="flex flex-1 p-2 bg-neutral-100 dark:bg-neutral-800 rounded-md"
              value={
                dob === 0
                  ? ""
                  : new Date(dob).toISOString().split("T")[0]
              }
              onChange={(e) => {
                if (
                  e.target.value.length > 0 &&
                  e.target.value !== undefined &&
                  e.target.value !== null
                ) {
                  setDob(+new Date(e.target.value));
                }
              }}
            /> */}
        <Select
          value={dob === null ? "" : monthIndex.toString()}
          placeholder="Month"
          options={[
            {
              value: "1",
              label: "January",
            },
            {
              value: "2",
              label: "February",
            },
            {
              value: "3",
              label: "March",
            },
            {
              value: "4",
              label: "April",
            },
            {
              value: "5",
              label: "May",
            },
            {
              value: "6",
              label: "June",
            },
            {
              value: "7",
              label: "July",
            },
            {
              value: "8",
              label: "August",
            },
            {
              value: "9",
              label: "September",
            },
            {
              value: "10",
              label: "October",
            },
            {
              value: "11",
              label: "November",
            },
            {
              value: "12",
              label: "December",
            },
          ]}
          onChange={(val) => {
            const newDate = new Date(dob);
            newDate.setMonth(parseInt(val) - 1); // Months are zero-based in JavaScript
            setDob(+newDate);
          }}
          className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-md"
        />
        <Select
          value={dob === null ? "" : new Date(dob).getDate().toString()}
          placeholder="Day"
          options={[...Array(31)].map((_, i) => ({
            value: (i + 1).toString(),
            label: (i + 1).toString(),
          }))}
          onChange={(val) => {
            const newDate = new Date(dob);
            newDate.setDate(parseInt(val));
            setDob(+newDate);
          }}
          className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-md"
        />
        <Select
          value={dob === null ? "" : new Date(dob).getFullYear().toString()}
          placeholder="Year"
          options={[...Array(150)].map((_, i) => ({
            value: (new Date().getFullYear() - (149 - i)).toString(),
            label: (new Date().getFullYear() - (149 - i)).toString(),
          }))}
          onChange={(val) => {
            const newDate = new Date(dob);
            newDate.setFullYear(parseInt(val));
            setDob(+newDate);
          }}
          className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-md"
        />
        {dob === null && <BiErrorCircle className="text-red-500 m-1 min-w-fit" />}
      </div>
    </>
  );
}
