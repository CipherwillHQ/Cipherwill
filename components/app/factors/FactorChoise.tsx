"use client";
import SimpleButton from "@/components/common/SimpleButton";
import { useState } from "react";
import AddMasterPassword from "./add/AddMasterPassword";

export default function FactorChoise({ continuous }) {
  const [choice, setChoice] = useState(null);
  return (
    <div className="bg-white dark:bg-neutral-800 text-black dark:text-white rounded-md p-2 w-[700px] max-w-[250px] sm:max-w-sm">
      {choice === null && (
        <div className="w-full">
          <h2 className="text-xl font-semibold py-2">Select Factor</h2>
          <SimpleButton
            className="w-full p-2"
            onClick={() => {
              setChoice("metapassword");
            }}
          >
            <span className="font-semibold">Meta Password</span>
          </SimpleButton>
        </div>
      )}
      {choice === "metapassword" && (
        <AddMasterPassword continuous={continuous} />
      )}
    </div>
  );
}
