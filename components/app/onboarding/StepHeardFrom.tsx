/**
 * Step 1 panel for onboarding — "How did you hear about us?"
 * Owns single-select option cards with animated radio indicators.
 * Does not own cross-step navigation, progress, or mutation submission.
 */
import { motion, AnimatePresence } from "framer-motion";
import { OnboardingOption } from "./types";

export default function StepHeardFrom({
  heardFromOptionId,
  heardFromCustom,
  heardFromOptions,
  onSelectOption,
  onCustomChange,
}: {
  heardFromOptionId: string;
  heardFromCustom: string;
  heardFromOptions: OnboardingOption[];
  onSelectOption: (value: string) => void;
  onCustomChange: (value: string) => void;
}) {
  const selectedOption = heardFromOptions.find(
    (option) => option.id === heardFromOptionId
  );

  return (
    <motion.div
      key="step-one"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-3.5"
    >
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
          How did you hear about us?
        </h2>
        <p className="text-sm text-gray-500">
          Help us understand which channels are working best.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        {heardFromOptions.map((option, idx) => {
          const isSelected = heardFromOptionId === option.id;
          return (
            <motion.button
              type="button"
              key={option.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.25 }}
              onClick={() => onSelectOption(option.id)}
              className={[
                "group relative flex items-center rounded-lg border-2 px-3 py-2 text-left transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary-50/80 shadow-sm"
                  : "border-gray-100 bg-white hover:border-primary-200 hover:bg-primary-50/30",
              ].join(" ")}
            >
              <span
                className={[
                  "text-sm font-medium transition-colors",
                  isSelected
                    ? "text-primary-800"
                    : "text-gray-700",
                ].join(" ")}
              >
                {option.label}
              </span>
              {isSelected && (
                <motion.span
                  layoutId="heard-from-check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-white"
                >
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedOption?.requires_custom_text && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <textarea
              value={heardFromCustom}
              onChange={(event) => onCustomChange(event.target.value)}
              placeholder="Tell us more — which platform, person, or search term brought you here?"
              className="min-h-18 w-full resize-none rounded-xl border-2 border-primary-200 bg-primary-50/40 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
