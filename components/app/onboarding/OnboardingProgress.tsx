/**
 * Visual step indicator for onboarding flow.
 * Owns rendering of step dots, connecting line, and labels.
 * Supports "light" (default) and "dark" variants for use on different backgrounds.
 * Does not own step state management or navigation logic.
 */
import { motion } from "framer-motion";

interface Step {
  label: string;
  number: number;
}

const STEPS: Step[] = [
  { label: "Discovery", number: 1 },
  { label: "Expectations", number: 2 },
];

export default function OnboardingProgress({
  currentStep,
  variant = "light",
}: {
  currentStep: number;
  variant?: "light" | "dark";
}) {
  const isDark = variant === "dark";

  const dotClasses = (isComplete: boolean, isActive: boolean) => {
    if (isComplete)
      return "bg-white text-primary";
    if (isActive)
      return isDark
        ? "bg-white text-primary-800 ring-4 ring-white/20"
        : "bg-primary text-white ring-4 ring-primary/20";
    return isDark
      ? "border-2 border-white/30 bg-transparent text-white/60"
      : "border-2 border-gray-200 bg-white text-gray-400";
  };

  const labelClasses = (isActiveOrComplete: boolean) =>
    isActiveOrComplete
      ? isDark
        ? "text-white"
        : "text-gray-900"
      : isDark
        ? "text-white/50"
        : "text-gray-400";

  const lineClasses = (isComplete: boolean) =>
    isComplete
      ? "bg-white"
      : isDark
        ? "bg-white/20"
        : "bg-gray-200";

  return (
    <nav aria-label="Onboarding progress" className="flex items-center gap-3">
      {STEPS.map((step, idx) => {
        const isActive = currentStep === step.number;
        const isComplete = currentStep > step.number;

        return (
          <div key={step.number} className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <motion.span
                initial={false}
                animate={{ scale: isActive ? 1.15 : 1 }}
                className={[
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors duration-300",
                  dotClasses(isComplete, isActive),
                ].join(" ")}
              >
                {isComplete ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2.5 6L5 8.5L9.5 3.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  step.number
                )}
              </motion.span>
              <span
                className={[
                  "text-sm font-medium transition-colors duration-300",
                  labelClasses(isActive || isComplete),
                ].join(" ")}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={[
                  "h-0.5 w-8 rounded-full transition-colors duration-500",
                  lineClasses(isComplete),
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
