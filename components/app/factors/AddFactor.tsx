"use client";

import SimpleButton from "@/components/common/SimpleButton";
import Popup from "reactjs-popup";
import FactorChoise from "./FactorChoise";

export default function AddFactor({ continuous }) {
  return (
    <>
      <Popup
        trigger={
          <div>
            <SimpleButton>Add Factor {!continuous && " Raw"}</SimpleButton>
          </div>
        }
        modal
      >
        <FactorChoise continuous={continuous} />
      </Popup>
      {/* <SimpleButton
        data-cy={
          continuous ? "add-factor-popup-button" : "add-raw-factor-popup-button"
        }
        // className="border border-blue-400 rounded-full text-sm bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-800 px-4 py-1"
        onClick={() => {
          setAddFactorPopup(true);
          setAddMetaPassword(false);
        }}
      >
        Add Factor {!continuous && " Raw"}
      </SimpleButton>

      <BasicPopup
        open={addFactorPopup}
        setOpen={(_e) => {
          setAddFactorPopup(false);
          setAddMetaPassword(false);
        }}
      >
        <h2 className="text-xl font-semibold py-2">Select Factor</h2>

        <div
          data-cy="add-factor-as-meta-password"
          className="cursor-pointer border rounded-md p-2 hover:bg-neutral-800"
          onClick={() => {
            setAddFactorPopup(false);
            setAddMetaPassword(true);
          }}
        >
          Meta Password
        </div>
      </BasicPopup>

      <BasicPopup
        open={addMetaPassword}
        setOpen={(_e) => {
          setAddMetaPassword(false);
          setAddFactorPopup(false);
        }}
      >
        <AddMasterPassword continuous={continuous} />
      </BasicPopup> */}
    </>
  );
}
