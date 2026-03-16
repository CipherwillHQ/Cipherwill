"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import UPDATE_USER from "../../../graphql/ops/auth/mutations/UPDATE_USER";
import ME from "../../../graphql/ops/auth/queries/ME";
import toast from "react-hot-toast";
import CountryRestrictionPopup from "../../../components/app/popups/CountryRestrictionPopup";
import Country from "./Country";
import Gender from "./Gender";
import DateOfBirth from "./DateOfBirth";
import Name from "./Name";
import {
  MeQuery,
  UpdateUserMutation,
  UpdateUserVariables,
} from "../../../types/interfaces";

type ProfileFormState = {
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: string;
  country: string;
  birth_date: string | null;
};

const AUTOSAVE_DELAY_MS = 700;

export default function Profile() {
  const [email, setEmail] = useState<string>("");
  const [form, setForm] = useState<ProfileFormState>({
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "",
    country: "",
    birth_date: null,
  });
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [saveTick, setSaveTick] = useState(0);

  const [countryRestrictionMessage, setCountryRestrictionMessage] =
    useState(false);

  const hasHydratedFromServer = useRef(false);
  const baselineRef = useRef<ProfileFormState | null>(null);
  const saveTimersRef = useRef<
    Partial<Record<keyof ProfileFormState, ReturnType<typeof setTimeout>>>
  >({});
  const saveSequenceRef = useRef(0);

  const { data: profileData, loading: profileLoading, refetch } =
    useQuery<MeQuery>(ME);

  const [updateProfile] = useMutation<
    UpdateUserMutation,
    UpdateUserVariables
  >(UPDATE_USER);

  const normalizeProfile = useCallback(
    (data: MeQuery["me"]): ProfileFormState => ({
      first_name: data.first_name || "",
      middle_name: data.middle_name || "",
      last_name: data.last_name || "",
      gender: data.gender || "",
      country: data.country || "",
      birth_date: data.birth_date ?? null,
    }),
    []
  );

  useEffect(() => {
    if (!profileData?.me) {
      return;
    }
    const normalized = normalizeProfile(profileData.me);
    setEmail(profileData.me.email || "");
    setForm(normalized);
    baselineRef.current = normalized;
    hasHydratedFromServer.current = true;
    setSaveStatus("idle");
  }, [normalizeProfile, profileData]);

  const scheduleSaveForField = useCallback(
    (key: keyof ProfileFormState, value: string | null) => {
      if (!hasHydratedFromServer.current || !baselineRef.current) {
        return;
      }

      if (saveTimersRef.current[key]) {
        clearTimeout(saveTimersRef.current[key]);
      }

      if (baselineRef.current[key] === value) {
        return;
      }

      saveTimersRef.current[key] = setTimeout(async () => {
        const baseline = baselineRef.current;
        if (!baseline || baseline[key] === value) {
          return;
        }

        const saveId = ++saveSequenceRef.current;
        setSaveStatus("saving");

        try {
          await updateProfile({
            variables: {
              data: {
                [key]: value,
              } as UpdateUserVariables["data"],
            },
            refetchQueries: [{ query: ME }],
            awaitRefetchQueries: true,
          });

          if (baselineRef.current) {
            baselineRef.current = {
              ...baselineRef.current,
              [key]: value,
            };
          }

          if (saveId === saveSequenceRef.current) {
            setSaveStatus("saved");
            setLastSavedAt(Date.now());
          }
        } catch (err: any) {
          const code = err?.graphQLErrors?.[0]?.extensions?.code;
          if (code === "COUNTRY_RESTRICTED_ACCORDING_TO_SUBSCRIPTION") {
            await refetch();
            setCountryRestrictionMessage(true);
          } else if (code !== "BIRTH_DATE_IN_FUTURE") {
            toast.error("Could not auto-save profile changes");
          }

          if (saveId === saveSequenceRef.current) {
            setSaveStatus("error");
          }
        }
      }, AUTOSAVE_DELAY_MS);
    },
    [refetch, updateProfile]
  );

  useEffect(() => {
    const timers = saveTimersRef.current;
    return () => {
      Object.values(timers).forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
    };
  }, []);

  useEffect(() => {
    if (!lastSavedAt) return;
    const interval = setInterval(() => {
      setSaveTick((x) => x + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [lastSavedAt]);

  useEffect(() => {
    scheduleSaveForField("first_name", form.first_name);
  }, [form.first_name, scheduleSaveForField]);

  useEffect(() => {
    scheduleSaveForField("middle_name", form.middle_name);
  }, [form.middle_name, scheduleSaveForField]);

  useEffect(() => {
    scheduleSaveForField("last_name", form.last_name);
  }, [form.last_name, scheduleSaveForField]);

  useEffect(() => {
    scheduleSaveForField("gender", form.gender);
  }, [form.gender, scheduleSaveForField]);

  useEffect(() => {
    scheduleSaveForField("country", form.country);
  }, [form.country, scheduleSaveForField]);

  useEffect(() => {
    scheduleSaveForField("birth_date", form.birth_date);
  }, [form.birth_date, scheduleSaveForField]);

  const dob = useMemo(
    () => {
      if (!form.birth_date) return null;
      const parsed = Number(form.birth_date);
      if (!Number.isFinite(parsed) || parsed <= 0) return null;
      return parsed;
    },
    [form.birth_date]
  );

  const saveStatusText = useMemo(() => {
    if (saveStatus === "saving") return "Saving changes...";
    if (saveStatus === "saved") return "All changes saved";
    if (saveStatus === "error") return "Some changes failed to save";
    return "Changes save automatically";
  }, [saveStatus]);

  const savedAgoText = (() => {
    if (!lastSavedAt || saveStatus === "saving") return "";
    const seconds = Math.max(0, Math.floor((Date.now() - lastSavedAt) / 1000));
    if (seconds < 5) return "Saved just now";
    if (seconds < 60) return `Saved ${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `Saved ${minutes}m ago`;
  })();

  if (profileLoading && !profileData?.me) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl flex flex-col justify-center border border-default rounded-md p-4 bg-secondary">
      {countryRestrictionMessage && profileData?.me && (
        <CountryRestrictionPopup
          open={countryRestrictionMessage}
          closeModal={() => setCountryRestrictionMessage(false)}
          currentCountry={profileData.me.country || ""}
        />
      )}
      <div className="text-lg font-medium pb-2">Profile Information</div>
      <label className="py-3 px-1 font-semibold text-sm">Email</label>
      <label className="p-2 bg-slate-100 dark:bg-neutral-900 border border-default text-slate-500 dark:text-slate-300 rounded-md">
        {email}
      </label>
      <Name
        firstName={form.first_name}
        setFirstName={(value: string) =>
          setForm((prev) => ({ ...prev, first_name: value }))
        }
        middleName={form.middle_name}
        setMiddleName={(value: string) =>
          setForm((prev) => ({ ...prev, middle_name: value }))
        }
        lastName={form.last_name}
        setLastName={(value: string) =>
          setForm((prev) => ({ ...prev, last_name: value }))
        }
      />
      <DateOfBirth
        dob={dob}
        setDob={(value: number | null) =>
          setForm((prev) => ({
            ...prev,
            birth_date:
              value !== null && Number.isFinite(value) && value > 0
                ? Math.trunc(value).toString()
                : null,
          }))
        }
      />
      <Gender
        gender={form.gender}
        setGender={(value: string) =>
          setForm((prev) => ({ ...prev, gender: value }))
        }
      />
      <Country
        country={form.country}
        setCountry={(value: string) =>
          setForm((prev) => ({ ...prev, country: value }))
        }
      />
      <div className="pt-4 text-right text-xs opacity-70">
        {saveStatusText}
        {savedAgoText ? ` • ${savedAgoText}` : ""}
      </div>
    </div>
  );
}
