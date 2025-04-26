import Select from "@/components/ui/Select";

export default function Gender({ gender, setGender }) {
  return (
    <>
      <label className="mt-2 py-3 px-1 font-semibold text-sm">Gender</label>
      <div className="flex justify-between items-center">
        <Select
          value={gender}
          onChange={(val) => setGender(val)}
          placeholder="Select Gender"
          className="w-full bg-neutral-100 dark:bg-neutral-800"
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "other", label: "Other" },
            { value: "na", label: "Do not specify" },
          ]}
        />
      </div>
    </>
  );
}
