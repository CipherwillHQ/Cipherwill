import { BiErrorCircle } from "react-icons/bi";

export default function Name({
    firstName,
    setFirstName,
    middleName,
    setMiddleName,
    lastName,
    setLastName,
}) {
  return (
    <>
      <label className="mt-2 py-3 px-1 font-semibold text-sm">First Name</label>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="First Name"
          className="flex flex-1 p-2 bg-neutral-100 dark:bg-neutral-800 rounded-md"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        {firstName === "" && <BiErrorCircle className="text-red-500 m-1" />}
      </div>
      <label className="mt-2 py-3 px-1 font-semibold text-sm">
        Middle Name
      </label>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Middle Name (optional)"
          className="flex flex-1 p-2 bg-neutral-100 dark:bg-neutral-800 rounded-md"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
        />
      </div>
      <label className="mt-2 py-3 px-1 font-semibold text-sm">Last Name</label>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Last Name (optional)"
          className="flex flex-1 p-2 bg-neutral-100 dark:bg-neutral-800 rounded-md"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
    </>
  );
}
