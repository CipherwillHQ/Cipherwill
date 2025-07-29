"use client";

import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import UPDATE_USER from "../../../graphql/ops/auth/mutations/UPDATE_USER";
import ME from "../../../graphql/ops/auth/queries/ME";
import toast from "react-hot-toast";
import CountryRestrictionPopup from "../../../components/app/popups/CountryRestrictionPopup";
import SimpleButton from "@/components/common/SimpleButton";
import Country from "./Country";
import Gender from "./Gender";
import DateOfBirth from "./DateOfBirth";
import Name from "./Name";

export default function Profile() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [dob, setDob] = useState<(null | number)>(null);

  const [countryRestrictionMessage, setCountryRestrictionMessage] =
    useState(false);

  const [fetchProfile, { data: ProfileData, loading:profile_loading }] = useLazyQuery(ME, {
    onCompleted: (data) => {
      if (data && data.me) {
        setEmail(data.me.email || "");
        setFirstName(data.me.first_name || "");
        setMiddleName(data.me.middle_name || "");
        setLastName(data.me.last_name || "");
        setGender(data.me.gender || "");
        setCountry(data.me.country || "");
        setDob(data.me.birth_date === null ? null : parseInt(data.me.birth_date));
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
          error.graphQLErrors[0].extensions?.code ===
            "COUNTRY_RESTRICTED_ACCORDING_TO_SUBSCRIPTION"
        ) {
          fetchProfile(); // reset the country to default one
          // show country restricted message
          setCountryRestrictionMessage(true);
        }
      },
    }
  );

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
      <div className="text-lg font-medium pb-2">Profile Information</div>
      <label className="py-3 px-1 font-semibold text-sm">Email</label>
      <label className="p-2 bg-slate-100 dark:bg-neutral-900 border border-default text-slate-500 dark:text-slate-300 rounded-md">
        {email}
      </label>
      <Name
        firstName={firstName}
        setFirstName={setFirstName}
        middleName={middleName}
        setMiddleName={setMiddleName}
        lastName={lastName}
        setLastName={setLastName}
      />
      {<DateOfBirth dob={dob} setDob={setDob} />}
      <Gender gender={gender} setGender={setGender} />
      <Country country={country} setCountry={setCountry} />
      <div className="pt-2 text-right">
        <SimpleButton
          onClick={() => {
            let data_to_update = {};
            const new_stamp = dob !== null ? (new Date(dob).getTime() || 0).toString() : "";

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
