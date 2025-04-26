import { BiErrorCircle } from "react-icons/bi";

export default function DateOfBirth({ dob, setDob }) {
      var tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds

  return (
    <>
      <label className="mt-2 py-3 px-1 font-semibold text-sm">
            Date of Birth
          </label>
          <div className="flex justify-between items-center">
            <input
              data-cy="dob-input"
              type="date"
              placeholder="Date of Birth"
              className="flex flex-1 p-2 bg-neutral-100 dark:bg-neutral-800 rounded-md"
              value={
                dob === 0
                  ? ""
                  : new Date(dob - tzoffset).toISOString().split("T")[0]
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
            />
            {dob === 0 && <BiErrorCircle className="text-red-500 m-1" />}
          </div>
    </>
  );
}