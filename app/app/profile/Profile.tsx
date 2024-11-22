"use client";

import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import UPDATE_USER from "../../../graphql/ops/auth/mutations/UPDATE_USER";
import ME from "../../../graphql/ops/auth/queries/ME";
import { BiErrorCircle } from "react-icons/bi";
import getAllCountryCodes from "../../../common/country/getAllCountryCodes";
import toast from "react-hot-toast";
import CountryRestrictionPopup from "../../../components/app/popups/CountryRestrictionPopup";
import SimpleButton from "@/components/common/SimpleButton";

export default function Profile() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [dob, setDob] = useState(0);

  const [countryRestrictionMessage, setCountryRestrictionMessage] =
    useState(false);

  const [fetchProfile, { data: ProfileData }] = useLazyQuery(ME, {
    onCompleted: (data) => {
      if (data && data.me) {
        setEmail(data.me.email || "");
        setFirstName(data.me.first_name || "");
        setMiddleName(data.me.middle_name || "");
        setLastName(data.me.last_name || "");
        setGender(data.me.gender || "");
        setCountry(data.me.country || "");
        setDob(data.me.birth_date === "0" ? 0 : parseInt(data.me.birth_date));
      }
    },
  });

  // useMutation
  const [updateProfile, { loading, error }] = useMutation(
    UPDATE_USER,

    {
      onError(error, clientOptions) {
        if (
          error.graphQLErrors !== null &&
          error.graphQLErrors.length > 0 &&
          error.graphQLErrors[0].extensions.code ===
            "COUNTRY_RESTRICTED_ACCORDING_TO_SUBSCRIPTION"
        ) {
          fetchProfile(); // reset the country to default one
          // show country restricted message
          setCountryRestrictionMessage(true);
        }
      },
    }
  );
  var tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  return (
    <div className="w-full max-w-3xl flex flex-col justify-center border border-default rounded-md p-4 bg-secondary">
      {countryRestrictionMessage && ProfileData && (
        <CountryRestrictionPopup
          open={countryRestrictionMessage}
          closeModal={() => setCountryRestrictionMessage(false)}
          currentCountry={ProfileData.me.country}
        />
      )}
      <div className="text-lg font-medium pb-2">
        Profile Information
      </div>
      <label className="py-3 px-1 font-semibold text-sm">Email</label>
      <label className="p-2 bg-slate-100 dark:bg-neutral-900 border border-default text-slate-500 dark:text-slate-300 rounded-md">
        {email}
      </label>
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
      <label className="mt-2 py-3 px-1 font-semibold text-sm">Middle Name</label>
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
      <label className="mt-2 py-3 px-1 font-semibold text-sm">Date of Birth</label>
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

      <label className="mt-2 py-3 px-1 font-semibold text-sm">Gender</label>
      <div className="flex justify-between items-center">
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="rounded-md mb-2 w-full p-2 bg-neutral-100 dark:bg-neutral-800"
        >
          <option value="" className="py-1">
            Select Gender
          </option>
          <option value="male" className="py-1">
            Male
          </option>
          <option value="female" className="py-1">
            Female
          </option>
          <option value="other" className="py-1">
            Other
          </option>
          <option value="na" className="py-1">
            Do not specify
          </option>
        </select>
      </div>
      <label className="mt-2 py-3 px-1 font-semibold text-sm">Country</label>
      <div className="flex justify-between items-center w-full">
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="rounded-md mb-2 w-full p-2 bg-neutral-100 dark:bg-neutral-800"
        >
          <option value="" className="py-1">
            Select Country
          </option>
          {getAllCountryCodes().map((country) => {
            return (
              <option key={country.code} value={country.code} className="py-1">
                {country.name}
              </option>
            );
          })}
        </select>
        {country === "" && <BiErrorCircle className="text-red-500 m-1" />}
      </div>
      <div className="pt-2 text-right">
        <SimpleButton
          onClick={() => {
            let data_to_update = {};
            const new_stamp = (new Date(dob).getTime() || 0).toString();

            if (ProfileData.me.first_name !== firstName)
              data_to_update["first_name"] = firstName;
            if (ProfileData.me.middle_name !== middleName)
              data_to_update["middle_name"] = middleName;
            if (ProfileData.me.last_name !== lastName)
              data_to_update["last_name"] = lastName;
            if (ProfileData.me.birth_date !== new_stamp)
              data_to_update["birth_date"] = new_stamp;
            if (ProfileData.me.gender !== gender)
              data_to_update["gender"] = gender;
            if (ProfileData.me.country !== country)
              data_to_update["country"] = country;

            // check if updates are empty
            if (Object.keys(data_to_update).length === 0) {
              return;
            }

            updateProfile({
              variables: {
                data: {
                  ...data_to_update,
                },
              },
              onCompleted: () => {
                fetchProfile({
                  fetchPolicy: "network-only",
                });
                toast.success("updated");
              },
            });
          }}
        >
          Save Profile
        </SimpleButton>
      </div>
    </div>
  );
}
