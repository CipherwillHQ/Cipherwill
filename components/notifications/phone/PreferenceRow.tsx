type NotificationPreferenceKeyInternal =
  | "mandatory_phone_calls"
  | "mandatory_sms"
  | "mandatory_whatsapp"
  | "promotional_phone_calls"
  | "promotional_sms"
  | "promotional_whatsapp";

export const ALLOWED_PREFERENCE_KEYS = [
  "mandatory_phone_calls",
  "mandatory_sms",
  "mandatory_whatsapp",
  "promotional_phone_calls",
  "promotional_sms",
  "promotional_whatsapp",
] as const;

export type NotificationPreferenceKey = (typeof ALLOWED_PREFERENCE_KEYS)[number];

export type PreferenceSectionConfig = {
  title: string;
  description: string;
  mandatoryKey: NotificationPreferenceKey;
  promotionalKey: NotificationPreferenceKey;
};

export const PREFERENCE_SECTIONS: PreferenceSectionConfig[] = [
  {
    title: "Phone Calls",
    description:
      "You'll receive a phone call from Cipherwill for important reminders, security alerts, and account activity.",
    mandatoryKey: "mandatory_phone_calls",
    promotionalKey: "promotional_phone_calls",
  },
  {
    title: "Text Messages (SMS)",
    description:
      "You'll receive important text messages from Cipherwill such as reminders, security alerts, and account activity notifications.",
    mandatoryKey: "mandatory_sms",
    promotionalKey: "promotional_sms",
  },
  {
    title: "Whatsapp Messages",
    description:
      "You'll receive important Whatsapp messages from Cipherwill such as reminders, security alerts, and account activity notifications.",
    mandatoryKey: "mandatory_whatsapp",
    promotionalKey: "promotional_whatsapp",
  },
];

const TOGGLE_TRACK_CLASS =
  "relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600";

type PhonePreferenceValues = Record<NotificationPreferenceKeyInternal, boolean>;

export type PreferenceRowPhoneNumber = {
  id: string;
} & PhonePreferenceValues;

type ToggleSwitchProps = {
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
};

function ToggleSwitch({ checked, disabled, onChange }: ToggleSwitchProps) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <div className={TOGGLE_TRACK_CLASS}></div>
    </label>
  );
}

type PreferenceToggleProps = {
  mobileLabel: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
};

function PreferenceToggle({
  mobileLabel,
  checked,
  disabled,
  onChange,
}: PreferenceToggleProps) {
  return (
    <div className="mt-2 md:max-w-1/6 w-full flex items-center justify-between md:justify-center">
      <div className="md:hidden font-medium">{mobileLabel}</div>
      <ToggleSwitch checked={checked} disabled={disabled} onChange={onChange} />
    </div>
  );
}

type PreferenceRowProps = {
  phoneNumber: PreferenceRowPhoneNumber;
  section: PreferenceSectionConfig;
  disabled: boolean;
  onToggle: (
    phoneId: string,
    key: NotificationPreferenceKey,
    value: boolean
  ) => void;
};

export default function PreferenceRow({
  phoneNumber,
  section,
  disabled,
  onToggle,
}: PreferenceRowProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between">
      <div className="md:max-w-2/3 w-full">
        <h4 className="font-semibold">{section.title}</h4>
        <p>{section.description}</p>
      </div>
      <PreferenceToggle
        mobileLabel="Mandatory Communication"
        checked={phoneNumber[section.mandatoryKey]}
        disabled={disabled}
        onChange={(checked) =>
          onToggle(phoneNumber.id, section.mandatoryKey, checked)
        }
      />
      <PreferenceToggle
        mobileLabel="Promotional Communication"
        checked={phoneNumber[section.promotionalKey]}
        disabled={disabled}
        onChange={(checked) =>
          onToggle(phoneNumber.id, section.promotionalKey, checked)
        }
      />
    </div>
  );
}
