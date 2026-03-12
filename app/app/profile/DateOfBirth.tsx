import { useRef } from "react";
import { BiCalendar, BiErrorCircle } from "react-icons/bi";

export default function DateOfBirth({ dob, setDob }) {
  const pickerOpenedAtRef = useRef<number>(0);
  const ignoredInitialIosAutofillRef = useRef(false);
  const inputValue =
    dob === null || !Number.isFinite(dob)
      ? ""
      : new Date(dob).toISOString().slice(0, 10);
  const minDate = `${new Date().getFullYear() - 150}-01-01`;
  const localToday = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
  const maxDate = localToday;
  const locale = Intl.DateTimeFormat().resolvedOptions().locale;
  const selectedDateText =
    dob === null || !Number.isFinite(dob)
      ? ""
      : new Date(dob).toLocaleDateString(locale, {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });

  return (
    <>
      <div className="mt-2 py-3 px-1 font-semibold text-sm flex items-center justify-between">
        <span>Date of Birth</span>
        {dob !== null && (
          <button
            type="button"
            onClick={() => setDob(null)}
            className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex w-full min-w-0 gap-2 justify-between items-center">
        <div className="relative flex-1 min-w-0 overflow-hidden">
        <input
          data-cy="dob-input"
          type="date"
          className="dob-date-input block w-full min-w-0 max-w-full box-border p-2 pr-10 bg-neutral-100 dark:bg-neutral-800 rounded-md border border-default"
          value={inputValue}
          min={minDate}
          max={maxDate}
          onPointerDown={() => {
            pickerOpenedAtRef.current = Date.now();
          }}
          onFocus={() => {
            pickerOpenedAtRef.current = Date.now();
          }}
          onChange={(e) => {
            const value = e.target.value;
            if (!value) {
              setDob(null);
              ignoredInitialIosAutofillRef.current = false;
              return;
            }
            // iOS can emit an immediate onChange with "today" when opening an empty date input.
            const looksLikeIosAutofill =
              inputValue === "" &&
              value === localToday &&
              !ignoredInitialIosAutofillRef.current &&
              Date.now() - pickerOpenedAtRef.current < 1500;
            if (looksLikeIosAutofill) {
              ignoredInitialIosAutofillRef.current = true;
              return;
            }
            const [year, month, day] = value.split("-").map((part) => parseInt(part, 10));
            const stamp = Date.UTC(year, month - 1, day);
            const date = new Date(stamp);
            const isExact =
              date.getUTCFullYear() === year &&
              date.getUTCMonth() + 1 === month &&
              date.getUTCDate() === day;
            if (!isExact || !Number.isFinite(stamp) || stamp <= 0) {
              setDob(null);
              return;
            }
            ignoredInitialIosAutofillRef.current = false;
            setDob(stamp);
          }}
        />
        <BiCalendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-300" />
        </div>
        {dob === null && (
          <BiErrorCircle className="text-red-500 m-1 shrink-0" />
        )}
      </div>
      {selectedDateText && (
        <div className="px-1 pt-2 text-xs opacity-70">Selected: {selectedDateText}</div>
      )}
      <style jsx global>{`
        .dob-date-input {
          max-width: 100%;
          min-width: 0;
        }
        .dob-date-input::-webkit-calendar-picker-indicator {
          opacity: 0;
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
