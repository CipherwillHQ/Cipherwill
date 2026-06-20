/**
 * Renders the input fields for the user's physical address on the profile page.
 * Owns the visual layout, labeling, and event handling for address line 1, line 2, city, state, and postal code.
 * Does NOT own data saving or country selection.
 */

import { BiErrorCircle } from "react-icons/bi";

interface AddressProps {
  addressLine1: string;
  setAddressLine1: (value: string) => void;
  addressLine2: string;
  setAddressLine2: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  state: string;
  setState: (value: string) => void;
  postalCode: string;
  setPostalCode: (value: string) => void;
}

export default function Address({
  addressLine1,
  setAddressLine1,
  addressLine2,
  setAddressLine2,
  city,
  setCity,
  state,
  setState,
  postalCode,
  setPostalCode,
}: AddressProps) {
  return (
    <>
      <label className="mt-2 py-3 px-1 font-semibold text-sm">Street Address</label>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Street address, P.O. box, company name"
          className="flex flex-1 p-2 bg-neutral-100 dark:bg-neutral-800 rounded-md"
          value={addressLine1}
          onChange={(e) => setAddressLine1(e.target.value)}
        />
        {addressLine1 === "" && <BiErrorCircle className="text-red-500 m-1" />}
      </div>

      <label className="mt-2 py-3 px-1 font-semibold text-sm">
        Apartment, suite, unit, building, floor, etc.
      </label>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Apartment, suite, unit, building, floor, etc. (optional)"
          className="flex flex-1 p-2 bg-neutral-100 dark:bg-neutral-800 rounded-md"
          value={addressLine2}
          onChange={(e) => setAddressLine2(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label className="mt-2 py-3 px-1 font-semibold text-sm">City</label>
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="City"
              className="flex flex-1 p-2 bg-neutral-100 dark:bg-neutral-800 rounded-md"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            {city === "" && <BiErrorCircle className="text-red-500 m-1" />}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="mt-2 py-3 px-1 font-semibold text-sm">State / Province / Region</label>
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="State / Province / Region"
              className="flex flex-1 p-2 bg-neutral-100 dark:bg-neutral-800 rounded-md"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            {state === "" && <BiErrorCircle className="text-red-500 m-1" />}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="mt-2 py-3 px-1 font-semibold text-sm">ZIP / Postal Code</label>
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="ZIP / Postal Code"
              className="flex flex-1 p-2 bg-neutral-100 dark:bg-neutral-800 rounded-md"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
            {postalCode === "" && <BiErrorCircle className="text-red-500 m-1" />}
          </div>
        </div>
      </div>
    </>
  );
}
