/**
 * Brand panel for onboarding — logo, value props.
 * Renders on the left side of the split onboarding layout (desktop).
 * Does not own any interactive logic, just static brand presence.
 */
import SymbolicLogo from "@/components/public/logo/SymbolicLogo";

const VALUE_PROPS = [
  { icon: "🔐", text: "End-to-end encrypted" },
  { icon: "⚡", text: "Set up in 3 minutes" },
  { icon: "🤝", text: "Trusted by thousands" },
];

export default function OnboardingBrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-5/12 xl:w-2/5 flex-col justify-between bg-linear-to-br from-primary-900 via-primary-800 to-primary-950 p-10 xl:p-14">
      <div className="space-y-8">
        <SymbolicLogo overrideTheme="dark" size={36} />
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white xl:text-4xl font-playfair">
            Set up your
            <br />
            Cipherwill
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-primary-200/80">
            Two quick questions to personalize your experience.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {VALUE_PROPS.map((prop) => (
          <div key={prop.text} className="flex items-center gap-3">
            <span className="text-lg">{prop.icon}</span>
            <span className="text-sm font-medium text-primary-100/90">
              {prop.text}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-primary-300/50">
        Takes less than 60 seconds
      </p>
    </div>
  );
}
