// Displays the compact progress indicator for the two onboarding questions.
// Owns step dots and the current step label.
// Does not manage answers, submit onboarding, or navigate.
export default function OnboardingStepIndicator({ step }: { step: number }) {
  return (
    <div className="mb-4 flex items-center gap-1.5">
      {[1, 2].map((s) => (
        <div
          key={s}
          className={[
            "h-1.5 rounded-full transition-all duration-300",
            s === 1 ? "w-4" : "w-1.5",
            step >= s
              ? "bg-primary"
              : "bg-gray-200",
          ].join(" ")}
        />
      ))}
      <span className="ml-1.5 text-xs font-medium text-gray-400">
        Step {step}/2
      </span>
    </div>
  );
}
