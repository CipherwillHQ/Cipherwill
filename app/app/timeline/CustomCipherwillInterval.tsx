import Select from "react-select";

export default function CustomCipherwillInterval() {
  return (
    <div>
      <Select
        options={[
          {
            label: "Annual (on Birthday's)",
            value: "annual",
          },
          {
            label: "Monthly",
            value: "monthly",
          },
        ]} 
      />
    </div>
  );
}
